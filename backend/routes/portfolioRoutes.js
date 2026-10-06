import express from "express";

import Portfolio from "../models/Portfolio.js";
import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "node:buffer";
import process from "node:process";

const router = express.Router();
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{1,28}[a-zA-Z0-9])$/;

const validatePortfolioInput = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Please provide valid portfolio data.";
  }

  for (const field of ["username", "name", "role"]) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return `${field[0].toUpperCase()}${field.slice(1)} is required.`;
    }
  }

  const username = body.username.trim();
  if (!USERNAME_PATTERN.test(username)) {
    return "Username must be 3–30 characters and use letters, numbers, hyphens, or underscores.";
  }

  return "";
};

const isDuplicateUsernameError = (error) => error?.code === 11000;

const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PROFILE_IMAGE_SIZE, files: 1, fields: 0, parts: 1 },
  fileFilter: (req, file, callback) => {
    if (allowedImageTypes.has(file.mimetype)) {
      return callback(null, true);
    }
    callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "profileImage"));
  },
});

const parseProfileImage = (req, res, next) => {
  profileImageUpload.single("profileImage")(req, res, (error) => {
    if (!error) return next();

    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Profile images must be 5 MB or smaller."
      : "Choose a JPG, JPEG, PNG, or WEBP image.";
    return res.status(400).json({ success: false, message });
  });
};

const matchesImageSignature = (file) => {
  const { buffer, mimetype } = file;

  if (mimetype === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimetype === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimetype === "image/webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
};

const validateSocialLinks = (socialLinks = {}) => {
  const fields = ["github", "linkedin", "website", "twitter"];

  for (const field of fields) {
    const rawValue = socialLinks?.[field];
    if (rawValue === undefined || rawValue === null) continue;
    if (typeof rawValue !== "string") {
      return `${field} must be a valid http or https URL`;
    }
    const value = rawValue.trim();
    if (!value) continue;

    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname) {
        return `${field} must be a valid http or https URL`;
      }
    } catch {
      return `${field} must be a valid http or https URL`;
    }
  }

  return "";
};


// CREATE PORTFOLIO

router.post("/upload-profile-image", parseProfileImage, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose a profile image to upload." });
  }

  if (!matchesImageSignature(req.file)) {
    return res.status(400).json({
      success: false,
      message: "The file contents do not match a supported image type.",
    });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({
      success: false,
      message: "Image uploads are not configured on the server.",
    });
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio-builder/profiles",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, uploadedImage) => {
          if (error) return reject(error);
          resolve(uploadedImage);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    if (!result?.secure_url) {
      throw new Error("Cloudinary did not return a secure image URL");
    }
    return res.status(201).json({ success: true, profileImage: result.secure_url });
  } catch (error) {
    console.error("Cloudinary profile image upload failed:", error.message);
    return res.status(502).json({
      success: false,
      message: "The profile image could not be uploaded. Please try again.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const inputError = validatePortfolioInput(req.body);
    if (inputError) {
      return res.status(400).json({ success: false, message: inputError });
    }

    const username = req.body.username.trim();
    const socialLinks = req.body.socialLinks ?? {};
    const socialLinkError = validateSocialLinks(socialLinks);
    if (socialLinkError) {
      return res.status(400).json({ success: false, message: socialLinkError });
    }

    const existingUser = await Portfolio.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }

    const portfolio = await Portfolio.create({
      username,
      name: req.body.name.trim(),
      role: req.body.role.trim(),
      about: typeof req.body.about === "string" ? req.body.about.trim() : "",
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      projects: Array.isArray(req.body.projects) ? req.body.projects : [],
      socialLinks,
      profileImage: typeof req.body.profileImage === "string" ? req.body.profileImage : "",
    });

    return res.status(201).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    if (isDuplicateUsernameError(error)) {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Please check the portfolio fields and try again." });
    }
    console.error("Portfolio create failed:", error.message);
    return res.status(500).json({ success: false, message: "Could not save portfolio. Please try again." });
  }
});


// GET ALL PORTFOLIOS

router.get("/", async (req, res) => {

  try {

    const portfolios =
      await Portfolio.find();

    res.status(200).json(portfolios);

  } catch (error) {
    console.error("Portfolio list failed:", error.message);
    res.status(500).json({ success: false, message: "Could not load portfolios. Please try again." });
  }

});


// GET SINGLE PORTFOLIO BY USERNAME

router.get("/id/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
  }

  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    res.status(200).json(portfolio);
  } catch {
    res.status(500).json({ success: false, message: "Could not load portfolio" });
  }
});

router.get("/:username", async (req, res) => {

  try {

    const portfolio =
      await Portfolio.findOne({
        username:
          req.params.username,
      });

    if (!portfolio) {

      return res.status(404).json({
        success: false,
        message:
          "Portfolio not found",
      });

    }

    res.status(200).json(
      portfolio
    );

  } catch (error) {
    console.error("Portfolio lookup failed:", error.message);
    res.status(500).json({ success: false, message: "Could not load portfolio. Please try again." });
  }

});


// UPDATE PORTFOLIO
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
  }

  try {
    const inputError = validatePortfolioInput(req.body);
    if (inputError) {
      return res.status(400).json({ success: false, message: inputError });
    }

    const username = req.body.username.trim();
    const { name, role, about, skills, projects, profileImage } = req.body;
    const socialLinks = req.body.socialLinks ?? {};
    const socialLinkError = validateSocialLinks(socialLinks);
    if (socialLinkError) {
      return res.status(400).json({ success: false, message: socialLinkError });
    }
    const existingPortfolio = await Portfolio.findById(req.params.id);
    if (!existingPortfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }

    const usernameOwner = await Portfolio.findOne({ username, _id: { $ne: req.params.id } });
    if (usernameOwner) {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        username,
        name: typeof name === "string" ? name.trim() : name,
        role: typeof role === "string" ? role.trim() : role,
        about: typeof about === "string" ? about.trim() : (existingPortfolio.about ?? ""),
        skills: Array.isArray(skills) ? skills : (existingPortfolio.skills ?? []),
        projects: Array.isArray(projects) ? projects : (existingPortfolio.projects ?? []),
        socialLinks: req.body.socialLinks ?? existingPortfolio.socialLinks ?? {},
        profileImage: profileImage ?? existingPortfolio.profileImage ?? "",
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, portfolio });
  } catch (error) {
    if (isDuplicateUsernameError(error)) {
      return res.status(409).json({ success: false, message: "Username already exists." });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Please check the portfolio fields and try again." });
    }
    console.error("Portfolio update failed:", error.message);
    return res.status(500).json({ success: false, message: "Could not update portfolio. Please try again." });
  }
});


// DELETE PORTFOLIO

router.delete("/:id", async (req, res) => {

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
  }

  try {

    const deletedPortfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!deletedPortfolio) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }

    res.status(200).json({
      success: true,
      message:
        "Portfolio deleted successfully",
    });

  } catch (error) {
    console.error("Portfolio delete failed:", error.message);
    res.status(500).json({ success: false, message: "Could not delete portfolio. Please try again." });
  }

});

export default router;
