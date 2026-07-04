const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Otp = require("../models/Otp");

const cleanDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in environment variables");
    }

    console.log("Connecting to database...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    console.log("Cleaning collections...");
    
    const userResult = await User.deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users.`);

    const companyResult = await Company.deleteMany({});
    console.log(`Deleted ${companyResult.deletedCount} companies.`);

    const jobResult = await Job.deleteMany({});
    console.log(`Deleted ${jobResult.deletedCount} jobs.`);

    const appResult = await Application.deleteMany({});
    console.log(`Deleted ${appResult.deletedCount} applications.`);

    const otpResult = await Otp.deleteMany({});
    console.log(`Deleted ${otpResult.deletedCount} OTPs.`);

    console.log("Database reset completed successfully!");
  } catch (error) {
    console.error("Failed to clean database:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

cleanDatabase();
