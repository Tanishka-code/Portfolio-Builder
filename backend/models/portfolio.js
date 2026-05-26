import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({

  name: {
    type: String,
  },

  role: {
    type: String,
  },

  about: {
    type: String,
  },

  skills: [
    {
      type: String,
    },
  ],

  projects: [
    {
      title: String,
      description: String,
    },
  ],

});

const Portfolio = mongoose.model(
  "Portfolio",
  portfolioSchema
);

export default Portfolio;