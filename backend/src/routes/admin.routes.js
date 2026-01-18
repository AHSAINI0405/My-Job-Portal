const router = require("express").Router();
const protect = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");

const adminController = require("../controllers/admin.controller");

// USERS
router.get("/users", protect, isAdmin, adminController.getAllUsers);
router.patch("/user/:id/block", protect, isAdmin, adminController.toggleUserBlock);

// COMPANIES
router.get("/companies", protect, isAdmin, adminController.getAllCompanies);
router.patch("/company/:id/block", protect, isAdmin, adminController.toggleCompanyBlock);

// JOBS
router.delete("/job/:id", protect, isAdmin, adminController.deleteJob);

module.exports = router;
