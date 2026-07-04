const Job = require("../models/Job");

/**
 * SEARCH JOBS FOR CANDIDATE
 * - keyword can match job title OR company name
 * - expired jobs are excluded
 */
exports.searchJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    // current date to block expired jobs
    const today = new Date();

    /**
     * $or → search in multiple fields
     * $regex → partial match
     * $options: "i" → case-insensitive
     */
    const query = {
      dueDate: { $gte: today },
    };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } }
      ];
    }

    const jobs = await Job.find(query)
      .populate("company", "name") // only get name
      .sort({ createdAt: -1 }); // latest jobs on top

    res.json(jobs);
  } catch (error) {
    console.error("Search Jobs Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




const User = require("../models/User");

/**
 * COMPANY SEARCH CANDIDATES
 * - name
 * - skills
 * - location
 */
exports.searchCandidates = async (req, res) => {
  try {
    const { keyword } = req.query;

    const query = {
      profileCompleted: true, // only complete profiles
    };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { skills: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } }
      ];
    }

    const users = await User.find(query).select("-password"); // never send password

    res.json(users);
  } catch (error) {
    console.error("Search Candidates Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
