const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

/**
 * Get all companies
 */
exports.getAllCompanies = async (req, res) => {
  const companies = await Company.find().select("-password");
  res.json(companies);
};

/**
 * Block or Unblock User
 */
exports.toggleUserBlock = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: "User block status updated" });
};

/**
 * Block or Unblock Company
 */
exports.toggleCompanyBlock = async (req, res) => {
  const company = await Company.findById(req.params.id);
  company.isBlocked = !company.isBlocked;
  await company.save();

  res.json({ message: "Company block status updated" });
};

/**
 * Delete Job Post
 */
exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted successfully" });
};
