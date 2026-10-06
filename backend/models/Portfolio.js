import mongoose from "mongoose";

const portfolioSchema =
  new mongoose.Schema({

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9](?:[a-zA-Z0-9_-]{1,28}[a-zA-Z0-9])$/,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },

    socialLinks: {
      github: String,
      linkedin: String,
      website: String,
      twitter: String,
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

  }, { bufferCommands: false });

const Portfolio =
  mongoose.model(
    "Portfolio",
    portfolioSchema
  );

export default Portfolio;
