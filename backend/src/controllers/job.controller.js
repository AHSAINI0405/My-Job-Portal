const Job = require("../models/Job");


// =======================================
// COMPANY → POST JOB
// =======================================
exports.createJob = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { title, description, location, salary, jobType, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and Due Date are required"
      });
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

  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// =======================================
// CANDIDATE → GET ACTIVE JOBS
// =======================================
exports.getActiveJobs = async (req, res) => {
  try {
    const today = new Date();

    // Automatically mark expired jobs
    await Job.updateMany(
      { dueDate: { $lt: today }, status: "active" },
      { $set: { status: "expired" } }
    );

    const jobs = await Job.find({
      dueDate: { $gte: today },
      status: "active"
    })
      .populate("company", "companyName email") // only required fields
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    console.error("Get Active Jobs Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// =======================================
// COMPANY → SEE ALL JOBS
// =======================================
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    console.error("Get Company Jobs Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// =======================================
// COMPANY → UPDATE JOB
// =======================================
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findOne({
      _id: jobId,
      company: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    Object.assign(job, req.body);

    await job.save();

    res.json({
      message: "Job updated successfully",
      job
    });

  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// =======================================
// COMPANY → DELETE JOB
// =======================================
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      company: req.user.id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};