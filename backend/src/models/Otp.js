const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ownerType: { type: String, enum: ["User", "Company"], required: true },

    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
