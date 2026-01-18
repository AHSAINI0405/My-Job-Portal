const User = require("../models/User");
const Company = require("../models/Company");

// ================= USER PROFILE COMPLETE =================
exports.completeUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      phone,
      education,
      skills,
      experience,
      location,
      resume,
    } = req.body;

    // basic validation
    if (!phone || !education || !skills || !experience) {
      return res.status(400).json({
        message: "All profile fields are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        phone,
        education,
        skills,
        experience,
        location,
        resume,
        profileCompleted: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Profile completed successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= COMPANY PROFILE COMPLETE =================
exports.completeCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.id;

    const {
      website,
      industry,
      description,
      location,
    } = req.body;

    if (!industry || !description || !location) {
      return res.status(400).json({
        message: "All company profile fields required",
      });
    }

    const company = await Company.findByIdAndUpdate(
      companyId,
      {
        website,
        industry,
        description,
        location,
        profileCompleted: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Company profile completed",
      company,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
