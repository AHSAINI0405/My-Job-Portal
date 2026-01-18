const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller");

// user profile
router.put(
  "/user",
  auth,
  profileController.completeUserProfile
);

// company profile
router.put(
  "/company",
  auth,
  profileController.completeCompanyProfile
);

module.exports = router;
