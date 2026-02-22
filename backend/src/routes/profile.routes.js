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

router.get("/company", auth, async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await Company.findById(req.user.id).select("-password");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Get company profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
