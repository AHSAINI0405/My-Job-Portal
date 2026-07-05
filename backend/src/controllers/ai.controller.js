const axios = require("axios");

/**
 * Send resume + job data to Python AI service
 */
exports.analyzeResume = async (req, res) => {
  const { resumeBase64, jobText } = req.body;

  try {
    const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const response = await axios.post(
      `${AI_URL}/analyze`,
      {
        resume_base64: resumeBase64,
        job_text: jobText
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      message: "AI service error"
    });
  }
};
