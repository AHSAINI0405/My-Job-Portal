const Application = require("../models/Application");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/**
 * COMPANY → SEND EMAIL TO CANDIDATE
 */
exports.emailCandidate = async (req, res) => {
  const companyId = req.user.id;      // logged-in company
  const { applicationId, subject, message } = req.body;

  /**
   * Step 1: Check application exists
   */
  const application = await Application.findOne({
    _id: applicationId,
    company: companyId
  }).populate("candidate");

  if (!application) {
    return res.status(404).json({
      message: "Application not found or unauthorized"
    });
  }

  const candidate = application.candidate;

  /**
   * Step 2: Send email
   */
  await sendMail({
    to: candidate.email,
    subject,
    html: `
      <h3>Hello ${candidate.name},</h3>
      <p>${message}</p>
      <br/>
      <p>Regards,<br/>Recruitment Team</p>
    `
  });

  res.json({
    message: "Email sent successfully to candidate"
  });
};
