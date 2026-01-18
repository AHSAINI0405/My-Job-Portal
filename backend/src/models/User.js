const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    // ===== PROFILE FIELDS =====
    phone: String,
    education: String,
    skills: [String],
    experience: String,
    location: String,
    resume: String, // later store cloud URL

    role: {
      type: String,
      enum: ["user", "company", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
