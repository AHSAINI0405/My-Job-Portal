const router = require("express").Router();
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
router.post("/verify-otp", auth.verifyOTP);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password",auth.resetPassword);
router.post("/resend-otp", auth.resendOTP);
module.exports = router;
