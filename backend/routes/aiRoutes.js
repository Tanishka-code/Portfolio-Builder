import express from "express";

const router = express.Router();

router.post(
  "/generate-bio",
  async (req, res) => {

    try {

      const { skills, role } =
        req.body;

      const bio = `
Aspiring ${role} passionate about building
modern and user-friendly applications.

Skilled in ${skills}
with a strong interest in creating
responsive, scalable, and impactful
digital experiences.
      `;

      res.status(200).json({
        bio,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "AI generation failed",
      });

    }

  }
);

export default router;