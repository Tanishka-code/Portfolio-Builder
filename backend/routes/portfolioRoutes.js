import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const portfolio = new Portfolio(req.body);

    await portfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio Saved Successfully",
      portfolio,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

router.get("/", async (req, res) => {

  try {

    const portfolios = await Portfolio.find();

    res.status(200).json(portfolios);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

router.get("/:id", async (req, res) => {

  try {

    const portfolio = await Portfolio.findById(req.params.id);

    res.status(200).json(portfolio);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

router.delete("/:id", async (req, res) => {

  try {

    await Portfolio.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Portfolio Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

export default router;