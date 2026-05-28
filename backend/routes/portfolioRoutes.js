import express from "express";

import Portfolio from "../models/Portfolio.js";

const router = express.Router();


// CREATE PORTFOLIO

router.post("/", async (req, res) => {

  try {

    const existingUser =
      await Portfolio.findOne({
        username: req.body.username,
      });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message:
          "Username already exists",
      });

    }

    const portfolio =
      await Portfolio.create(req.body);

    res.status(201).json({
      success: true,
      portfolio,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});


// GET ALL PORTFOLIOS

router.get("/", async (req, res) => {

  try {

    const portfolios =
      await Portfolio.find();

    res.status(200).json(portfolios);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});


// GET SINGLE PORTFOLIO BY USERNAME

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

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});


// DELETE PORTFOLIO

router.delete("/:id", async (req, res) => {

  try {

    await Portfolio.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Portfolio deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

export default router;