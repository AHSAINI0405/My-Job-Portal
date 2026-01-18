const Job = require("../models/Job");

/**
 * SEARCH JOBS FOR CANDIDATE
 * - keyword can match job title OR company name
 * - expired jobs are excluded
 */
exports.searchJobs = async (req, res) => {
  const { keyword } = req.query;

  // current date to block expired jobs
  const today = new Date();

  /**
   * $or → search in multiple fields
   * $regex → partial match
   * $options: "i" → case-insensitive
   */
  const jobs = await Job.find({
    dueDate: { $gte: today },
    $or: [
      { title: { $regex: keyword, $options: "i" } }
    ]
  })
    .populate("company", "companyName") // only get companyName
    .sort({ createdAt: -1 }); // latest jobs on top

  res.json(jobs);
};




const User = require("../models/User");

/**
 * COMPANY SEARCH CANDIDATES
 * - name
 * - skills
 * - location
 */
exports.searchCandidates = async (req, res) => {
  const { keyword } = req.query;

  const users = await User.find({
    profileCompleted: true, // only complete profiles
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { "profile.skills": { $regex: keyword, $options: "i" } },
      { "profile.location": { $regex: keyword, $options: "i" } }
    ]
  }).select("-password"); // never send password

  res.json(users);
};
