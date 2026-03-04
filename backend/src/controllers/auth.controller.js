const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const Company = require("../models/Company")


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      profileCompleted: false,
    });

    // 🔥 If role is company → create company profile
    if (role === "company") {
      await Company.create({
        _id: user._id,   // VERY IMPORTANT (must match user ID)
        name: name,
        email: email,
        website: "",
        industry: "",
        description: "",
        location: "",
        logo: "",
        profileCompleted: false,
      });
    }

    // 🔐 Generate OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.create({
      ownerId: user._id,
      ownerType: role,
      otp: hashedOtp,
      purpose: "email_verification",
      attempts: 0,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Verify Your Email",
      `Your OTP is: ${otp}`
    );

    res.status(201).json({
      message: "Registered successfully. OTP sent to email.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpDoc = await Otp.findOne({
      ownerId: user._id,
      purpose: "email_verification",
    });

    if (!otpDoc)
      return res.status(400).json({ message: "OTP not found" });

    if (otpDoc.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (otpDoc.attempts >= 5)
      return res.status(429).json({ message: "Too many attempts" });

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    await user.save();
    await Otp.deleteOne({ _id: otpDoc._id });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RESEND OTP =================
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    // Delete existing OTP for email verification
    await Otp.deleteMany({
      ownerId: user._id,
      purpose: "email_verification",
    });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.create({
      ownerId: user._id,
      ownerType: user.role,
      otp: hashedOtp,
      purpose: "email_verification",
      attempts: 0,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await sendEmail(
      email,
      "Resend Email Verification OTP",
      `Your new OTP is: ${otp}`
    );

    res.json({ message: "New OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password,role } = req.body;

    const user = await User.findOne({ email });
    if(!role)
      return res.status(400).json({message:"Invalid Role"});
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted:user.profileCompleted,
        role:user.role
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    return res.status(500).json({ message: "Login failed" });
  }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 🔥 Delete old password reset OTPs
    await Otp.deleteMany({
      ownerId: user._id,
      purpose: "password_reset",
    });

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.create({
      ownerId: user._id,
      ownerType: user.role,
      otp: hashedOtp,
      purpose: "password_reset",
      attempts: 0,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    });

    await sendEmail(
      email,
      "Reset Password OTP",
      `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent for password reset" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otpDoc = await Otp.findOne({
      ownerId: user._id,
      purpose: "password_reset",
    });

    if (!otpDoc)
      return res.status(400).json({ message: "OTP not found" });

    if (otpDoc.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (otpDoc.attempts >= 5)
      return res.status(429).json({ message: "Too many attempts" });

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after success
    await Otp.deleteOne({ _id: otpDoc._id });

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};