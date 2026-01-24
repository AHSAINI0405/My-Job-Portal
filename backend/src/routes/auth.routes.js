const router = require("express").Router();
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
router.post("/verify-otp", auth.verifyOTP);
router.post("/login", auth.login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", authController.resendOTP);
module.exports = router;
