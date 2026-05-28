import mongoose from "mongoose";

const portfolioSchema =
  new mongoose.Schema({

    username: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    about: {
      type: String,
    },

    skills: [
      String,
    ],

    projects: [
      {
        title: String,
        description: String,
      },
    ],

  });

const Portfolio =
  mongoose.model(
    "Portfolio",
    portfolioSchema
  );

export default Portfolio;