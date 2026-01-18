const Job = require("../models/Job");

// COMPANY → POST JOB
exports.createJob = async (req, res) => {
  const companyId = req.user.id;
  const { title, description, location, salary, jobType, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ message: "Title & due date required" });
  }

  const job = await Job.create({
    title,
    description,
    location,
    salary,
    jobType,
    dueDate,
    company: companyId
  });

  res.status(201).json({
    message: "Job posted successfully",
    job
  });
};

// CANDIDATE → GET ACTIVE JOBS ONLY
exports.getActiveJobs = async (req, res) => {
  const today = new Date();

  const jobs = await Job.find({
    dueDate: { $gte: today },
    status: "active"
  })
    .populate("company")
    .sort({ createdAt: -1 });

  res.json(jobs);
};

// COMPANY → SEE ALL JOBS (ACTIVE + EXPIRED)
exports.getCompanyJobs = async (req, res) => {
  const jobs = await Job.find({ company: req.user.id })
    .sort({ createdAt: -1 });

  res.json(jobs);
};
