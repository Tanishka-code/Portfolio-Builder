import dotenv from "dotenv";

dotenv.config();

import express from "express";

import mongoose from "mongoose";

import cors from "cors";

import portfolioRoutes
from "./routes/portfolioRoutes.js";

import aiRoutes
from "./routes/aiRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api/portfolio",
  portfolioRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB Connected"
    );

  })
  .catch((error) => {

    console.log(error);

  });

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});