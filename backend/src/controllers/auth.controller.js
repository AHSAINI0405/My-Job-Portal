const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
const Otp = require("../models/Otp");
const { generateOTP } = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

// REGISTER (User / Company)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const Model = role === "company" ? Company : User;

  const exists = await Model.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const otp = generateOTP();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Model.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
  });

  res.json({ message: "OTP sent to email" });
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp, role } = req.body;

  const Model = role === "company" ? Company : User;

  const user = await Model.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  const Model = role === "company" ? Company : User;

  const user = await Model.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Email not verified" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role, user: { name: user.name, email: user.email, role: user.role } });
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email, ownerType } = req.body;
    // ownerType = "User" or "Company"

    // 1️⃣ Find account
    const Model = ownerType === "Company" ? Company : User;
    const owner = await Model.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: "Account not found" });
    }

    // 2️⃣ Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3️⃣ Save OTP
    await Otp.create({
      ownerId: owner._id,
      ownerType,
      otp: otpCode,
      purpose: "email",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });

    // 4️⃣ Send OTP (EMAIL LATER)
    console.log("Password reset OTP:", otpCode);

    res.json({ message: "OTP sent to registered email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, ownerType, otp, newPassword } = req.body;

    const Model = ownerType === "Company" ? Company : User;
    const owner = await Model.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: "Account not found" });
    }

    // 1️⃣ Find OTP
    const otpDoc = await Otp.findOne({
      ownerId: owner._id,
      ownerType,
      otp,
      purpose: "email",
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 2️⃣ Check expiry
    if (otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 3️⃣ Hash new password
    owner.password = await bcrypt.hash(newPassword, 10);
    await owner.save();

    // 4️⃣ Delete OTP
    await Otp.deleteMany({ ownerId: owner._id });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, ownerType, otp, newPassword } = req.body;

    const Model = ownerType === "Company" ? Company : User;
    const owner = await Model.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: "Account not found" });
    }

    // 1️⃣ Find OTP
    const otpDoc = await Otp.findOne({
      ownerId: owner._id,
      ownerType,
      otp,
      purpose: "email",
    });

    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 2️⃣ Check expiry
    if (otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 3️⃣ Hash new password
    owner.password = await bcrypt.hash(newPassword, 10);
    await owner.save();

    // 4️⃣ Delete OTP
    await Otp.deleteMany({ ownerId: owner._id });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= ADMIN CHECK =================
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
