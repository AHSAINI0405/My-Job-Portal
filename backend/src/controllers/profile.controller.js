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
      name,
  website,
  industry,
  description,
  location,
  logo,
    } = req.body;

    if (!industry || !description || !location) {
      return res.status(400).json({
        message: "All company profile fields required",
      });
    }

    const company = await Company.findByIdAndUpdate(
      companyId,
      {name,
        website,
        industry,
        description,
        location,
        logo,
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

// COMPANY PROFILE

exports.companyProfile=async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await Company.findById(req.user.id).select("-password");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Get company profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};