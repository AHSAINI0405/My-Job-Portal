const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller");
const Company=require("../models/Company");
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

router.get("/company", auth,profileController.companyProfile);
router.get("/user",auth,profileController.userProfile);
router.get("/companies", profileController.getAllCompanies);
module.exports = router;


