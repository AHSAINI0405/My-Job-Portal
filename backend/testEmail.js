require("dotenv").config();
const sendEmail = require("./src/utils/sendEmail");

(async () => {
  console.log("Testing backend email...");
  await sendEmail("test@example.com", "Test Subject", "This is a test body with OTP 123456");
  console.log("Test finished.");
})();
