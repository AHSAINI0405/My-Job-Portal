const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    // ===== PROFILE FIELDS =====
    website: String,
    industry: String,
    description: String,
    location: String,

    role: {
      type: String,
      default: "company",
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

module.exports = mongoose.model("Company", companySchema);
