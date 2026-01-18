const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    description: String,
    location: String,
    salary: String,
    jobType: String,

    dueDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
