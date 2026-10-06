import { useContext, useRef, useState } from "react";

import axios from "axios";

import { ThemeContext } from "../context/ThemeContext";
import ProfileAvatar from "./ProfileAvatar";
import { PORTFOLIO_API_URL } from "../api";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const usernamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{1,28}[a-zA-Z0-9])$/;

const socialFields = [
  { key: "github", label: "GitHub URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "website", label: "Portfolio Website URL" },
  { key: "twitter", label: "X / Twitter URL (optional)" },
];

const isValidSocialUrl = (value) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
};

const PortfolioForm = ({
  formData,
  setFormData,
  projects,
  setProjects,
  portfolioId,
  isEditing,
  onSaved,
  onError,
  profileImageFile,
  setProfileImageFile,
  profileImagePreview,
  setProfileImagePreview,
}) => {

  const [project, setProject] = useState({
    title: "",
    description: "",
  });
  const [socialError, setSocialError] = useState("");
  const [imageError, setImageError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const imageInputRef = useRef(null);
  const savingRef = useRef(false);

  const { darkMode } =
    useContext(ThemeContext);

  const handleAddProject = () => {

    const title = project.title.trim();
    const description = project.description.trim();
    if (!title || !description)
      return;

    setProjects([...projects, { title, description }]);

    setProject({
      title: "",
      description: "",
    });

  };

  const savePortfolio = async () => {
    if (savingRef.current) return;

    setSaveError("");
    setSuccessMessage("");
    setImageError("");
    setFieldErrors({});
    if (onError) onError("");

    const username = (formData.username || "").trim();
    const name = (formData.name || "").trim();
    const role = (formData.role || "").trim();
    const nextFieldErrors = {};

    if (!username) {
      nextFieldErrors.username = "Username is required.";
    } else if (!usernamePattern.test(username)) {
      nextFieldErrors.username = "Use 3–30 letters, numbers, hyphens, or underscores. Start and end with a letter or number.";
    }
    if (!name) nextFieldErrors.name = "Name is required.";
    if (!role) nextFieldErrors.role = "Role is required.";

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    const invalidSocialField = socialFields.find(({ key }) =>
      !isValidSocialUrl(formData.socialLinks?.[key] || "")
    );
    if (invalidSocialField) {
      setSocialError(`${invalidSocialField.label.replace(" URL", "")} must be a valid http or https URL.`);
      return;
    }
    setSocialError("");

    if (isEditing && !portfolioId) {
      setSaveError("The portfolio is still loading or could not be loaded. Please return to Saved Portfolios and try again.");
      return;
    }

    savingRef.current = true;
    setIsSaving(true);
    let uploadingProfileImage = false;

    try {
      let profileImage = formData.profileImage || "";
      if (profileImageFile) {
        uploadingProfileImage = true;
        const imageFormData = new FormData();
        imageFormData.append("profileImage", profileImageFile);
        const uploadResponse = await axios.post(
          `${PORTFOLIO_API_URL}/upload-profile-image`,
          imageFormData
        );
        profileImage = uploadResponse.data.profileImage;
        uploadingProfileImage = false;
      }

      const portfolioData = {
        username,
        name,
        role,
        about: (formData.about || "").trim(),
        skills: (formData.skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        projects: projects
          .map((item) => ({
            title: (item.title || "").trim(),
            description: (item.description || "").trim(),
          }))
          .filter((item) => item.title || item.description),
        profileImage,
        socialLinks: Object.fromEntries(
          socialFields.map(({ key }) => [
            key,
            formData.socialLinks?.[key]?.trim() || "",
          ])
        ),
      };

      if (portfolioId) {
        await axios.put(
          `${PORTFOLIO_API_URL}/${portfolioId}`,
          portfolioData
        );
        if (onSaved) onSaved(username);
        return;
      }

      await axios.post(
        PORTFOLIO_API_URL,
        portfolioData
      );
      setSuccessMessage("Portfolio saved successfully.");
    } catch (error) {
      const backendMessage = error.response?.data?.message || "";
      const message = /username.*(already exists|duplicate)|duplicate key/i.test(backendMessage)
        ? "That username is already in use. Choose another username."
        : backendMessage || "Could not save your portfolio. Check your connection and try again.";

      if (uploadingProfileImage) {
        setImageError(message);
      } else {
        setSaveError(message);
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`rounded-[32px] border shadow-xl p-10 transition duration-500 ${
        darkMode
          ? "bg-[#14141c] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >

      <h1 className="text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
        {isEditing ? "Edit Portfolio" : "Create Portfolio"}
      </h1>

      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-dashed border-purple-300 p-5">
          <ProfileAvatar
            src={profileImagePreview || formData.profileImage}
            alt="Selected profile image preview"
            className="h-24 w-24"
          />
          <div className="min-w-0 flex-1">
            <label
              htmlFor="profile-image-upload"
              className={`block font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
            >
              Profile Image
            </label>
            <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              JPG, JPEG, PNG, or WEBP. Maximum 5 MB.
            </p>
            <input
              id="profile-image-upload"
              ref={imageInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setImageError("");
                if (!file) return;
                if (!acceptedImageTypes.has(file.type)) {
                  setImageError("Choose a JPG, JPEG, PNG, or WEBP image.");
                  setProfileImageFile(null);
                  setProfileImagePreview("");
                  event.target.value = "";
                  return;
                }
                if (file.size > MAX_PROFILE_IMAGE_SIZE) {
                  setImageError("Profile images must be 5 MB or smaller.");
                  setProfileImageFile(null);
                  setProfileImagePreview("");
                  event.target.value = "";
                  return;
                }
                setProfileImageFile(file);
                setProfileImagePreview(URL.createObjectURL(file));
              }}
              className={`mt-3 block w-full text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            />
            {profileImageFile && (
              <button
                type="button"
                onClick={() => {
                  setProfileImageFile(null);
                  setProfileImagePreview("");
                  if (imageInputRef.current) imageInputRef.current.value = "";
                  setImageError("");
                }}
                className="mt-2 text-sm font-semibold text-purple-500 hover:text-purple-600"
              >
                Cancel image replacement
              </button>
            )}
            {imageError && (
              <p role="alert" className="mt-2 text-sm text-red-500">
                {imageError}
              </p>
            )}
          </div>
        </div>

        <input
          type="text"
          aria-label="Username (unique)"
          placeholder="Username (unique)"
          maxLength={30}
          autoCapitalize="none"
          autoCorrect="off"
          value={formData.username}
          aria-invalid={Boolean(fieldErrors.username)}
          aria-describedby={fieldErrors.username ? "username-error" : undefined}
          onChange={(e) => {
            setFieldErrors((current) => ({ ...current, username: "" }));
            setSaveError("");
            setSuccessMessage("");
            setFormData({
              ...formData,
              username: e.target.value,
            });
          }}
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          } ${fieldErrors.username ? "border-red-500 ring-1 ring-red-500" : ""}`}
        />
        {fieldErrors.username && (
          <p id="username-error" role="alert" className="-mt-4 text-sm text-red-500">
            {fieldErrors.username}
          </p>
        )}

        <input
          type="text"
          aria-label="Your name"
          placeholder="Your Name"
          value={formData.name}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          onChange={(e) => {
            setFieldErrors((current) => ({ ...current, name: "" }));
            setSaveError("");
            setSuccessMessage("");
            setFormData({
              ...formData,
              name: e.target.value,
            });
          }}
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          } ${fieldErrors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
        />
        {fieldErrors.name && (
          <p id="name-error" role="alert" className="-mt-4 text-sm text-red-500">
            {fieldErrors.name}
          </p>
        )}

        <input
          type="text"
          aria-label="Your role"
          placeholder="Your Role"
          value={formData.role}
          aria-invalid={Boolean(fieldErrors.role)}
          aria-describedby={fieldErrors.role ? "role-error" : undefined}
          onChange={(e) => {
            setFieldErrors((current) => ({ ...current, role: "" }));
            setSaveError("");
            setSuccessMessage("");
            setFormData({
              ...formData,
              role: e.target.value,
            });
          }}
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          } ${fieldErrors.role ? "border-red-500 ring-1 ring-red-500" : ""}`}
        />
        {fieldErrors.role && (
          <p id="role-error" role="alert" className="-mt-4 text-sm text-red-500">
            {fieldErrors.role}
          </p>
        )}

        <textarea
          aria-label="About you"
          placeholder="About You"
          value={formData.about}
          onChange={(e) =>
            setFormData({
              ...formData,
              about: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none h-40 transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

        <input
          type="text"
          aria-label="Skills, comma separated"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

        <div className="space-y-4 pt-2">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Social &amp; Contact Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialFields.map(({ key, label }) => (
              <input
                key={key}
                type="url"
                aria-label={label}
                placeholder={label}
                value={formData.socialLinks?.[key] || ""}
                onChange={(e) => {
                  setSocialError("");
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      [key]: e.target.value,
                    },
                  });
                }}
                className={`w-full p-5 rounded-2xl outline-none transition ${
                  darkMode
                    ? "bg-[#1c1c26] border border-gray-700 text-white"
                    : "bg-[#f7f7fb] border border-gray-200 text-black"
                }`}
              />
            ))}
          </div>
          {socialError && (
            <p role="alert" className="text-red-500">
              {socialError}
            </p>
          )}
        </div>

      </div>

      <div className="mt-14">

        <h2
          className={`text-4xl font-bold mb-6 ${
            darkMode
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          Add Projects
        </h2>

        <div className="space-y-6">

          <input
            type="text"
            aria-label="Project title"
            placeholder="Project Title"
            value={project.title}
            onChange={(e) =>
              setProject({
                ...project,
                title: e.target.value,
              })
            }
            className={`w-full p-5 rounded-2xl outline-none transition ${
              darkMode
                ? "bg-[#1c1c26] border border-gray-700 text-white"
                : "bg-[#f7f7fb] border border-gray-200 text-black"
            }`}
          />

          <textarea
            aria-label="Project description"
            placeholder="Project Description"
            value={project.description}
            onChange={(e) =>
              setProject({
                ...project,
                description: e.target.value,
              })
            }
            className={`w-full p-5 rounded-2xl outline-none h-32 transition ${
              darkMode
                ? "bg-[#1c1c26] border border-gray-700 text-white"
                : "bg-[#f7f7fb] border border-gray-200 text-black"
            }`}
          />

          <div className="flex gap-4">

            <button
              type="button"
              onClick={handleAddProject}
              className="bg-purple-600 hover:bg-purple-700 transition px-6 py-4 rounded-2xl font-semibold text-white shadow-lg"
            >
              Add Project
            </button>

            <button
              type="button"
              onClick={savePortfolio}
              disabled={isSaving}
              aria-busy={isSaving}
              className="bg-green-500 hover:bg-green-600 transition px-6 py-4 rounded-2xl font-semibold text-white shadow-lg disabled:cursor-wait disabled:opacity-70"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Portfolio"
                  : "Save Portfolio"}
            </button>

          </div>

          {saveError && (
            <p role="alert" className="rounded-2xl bg-red-100 p-4 text-sm text-red-700">
              {saveError}
            </p>
          )}
          {successMessage && (
            <p role="status" className="rounded-2xl bg-green-100 p-4 text-sm text-green-800">
              {successMessage}
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default PortfolioForm;
