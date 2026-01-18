const User = require("../models/User");
const Company = require("../models/Company");

module.exports = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    let account;

    if (role === "user") {
      account = await User.findById(id);
    } else if (role === "company") {
      account = await Company.findById(id);
    }

    if (!account || !account.profileCompleted) {
      return res.status(403).json({
        message: "Complete your profile first",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
