const Application = require("../models/Application");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/**
 * COMPANY → SEND EMAIL TO CANDIDATE
 */
exports.emailCandidate = async (req, res) => {
  try {
    const companyId = req.user.id;      // logged-in company
    const { applicationId, subject, message } = req.body;

    /**
     * Step 1: Check application exists
     */
    const application = await Application.findOne({
      _id: applicationId,
      company: companyId
    }).populate("user");

    if (!application || !application.user) {
      return res.status(404).json({
        message: "Application or candidate not found or unauthorized"
      });
    }

    const candidate = application.user;

    /**
     * Step 2: Send email
     */
    const htmlContent = `
      <h3>Hello ${candidate.name || "Candidate"},</h3>
      <p>${message}</p>
      <br/>
      <p>Regards,<br/>Recruitment Team</p>
    `;

    await sendEmail(candidate.email, subject, message, htmlContent);

    res.json({
      message: "Email sent successfully to candidate"
    });
  } catch (error) {
    console.error("Email Candidate Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
