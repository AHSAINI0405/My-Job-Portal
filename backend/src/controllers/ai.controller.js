const axios = require("axios");

/**
 * Send resume + job data to Python AI service
 */
exports.analyzeResume = async (req, res) => {
  const { resumeText, jobText } = req.body;

  try {
    const response = await axios.post(
      "http://localhost:8000/analyze",
      {
        resume_text: resumeText,
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
