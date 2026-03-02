const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

exports.getCompanyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      company: req.user.id, // employer id
    })
      .populate("user", "name email skills resume")
      .populate("job", "title description");

    res.json(applications);
  } catch (error) {
    console.error("Company applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * SHORTLIST CANDIDATE
 */
exports.shortlistCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "shortlisted";
    await application.save();
    console.log("Successfully done");
    // // 📧 Email candidate
    // await sendEmail({
    //   to: application.user.email,
    //   subject: "You are shortlisted 🎉",
    //   html: `
    //     <h3>Congratulations ${application.user.name}</h3>
    //     <p>You have been shortlisted for <b>${application.job.title}</b>.</p>
    //     <p>The company will contact you soon.</p>
    //   `,
    // });

    res.json({ message: "Candidate shortlisted & email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REJECT CANDIDATE
 */
exports.rejectCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "rejected";
    await application.save();

    // // 📧 Email candidate
    // await sendEmail({
    //   to: application.user.email,
    //   subject: "Application Update",
    //   html: `
    //     <h3>Hello ${application.user.name}</h3>
    //     <p>Thank you for applying for <b>${application.job.title}</b>.</p>
    //     <p>We regret to inform you that you were not selected.</p>
    //   `,
    // });

    res.json({ message: "Candidate rejected & email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * APPLY TO JOB
 */
exports.applyToJob = async (req, res) => {
  try {
    const userId = req.user.id;        // from JWT middleware
    const jobId = req.params.jobId;

    // 1️⃣ Check user profile completion
    const user = await User.findById(userId);
    if (!user.profileCompleted) {
      return res.status(400).json({
        message: "Complete your profile before applying",
      });
    }

    // 2️⃣ Check job exists & not expired
    const job = await Job.findById(jobId);
    if (!job || job.dueDate < new Date()) {
      return res.status(404).json({
        message: "Job not available",
      });
    }

    // 3️⃣ Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      user: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied to this job",
      });
    }

    // 4️⃣ Create application
    await Application.create({
      job: job._id,
      user: userId,
      company: job.company,
    });

    res.status(201).json({
      message: "Applied successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * GET APPLIED JOBS (USER DASHBOARD)
 */
exports.getAppliedJobs = async (req, res) => {
  const applications = await Application.find({
    user: req.user.id,
  }).populate("job")
  .populate("company")
  .populate("user");

  res.json(applications);
};



/**
 * COMPANY VIEW APPLICANTS
 */
exports.getApplicantsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({
      job: jobId,
    })
      .populate("user")
      .populate("job", "title description");

    res.json(applications);
  } catch (error) {
    console.error("Get applicants error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const axios = require("axios");

/**
 * AI MATCH SCORE
 */
exports.getAIMatchScore = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL || "http://localhost:8000"}/match`,
      {
        resume_text: application.user.resume || "",
        job_text: application.job.description
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI match error:", err.message);
    res.status(500).json({
      message: "AI service error",
      error: err.message
    });
  }
};
