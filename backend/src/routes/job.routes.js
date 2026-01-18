const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const companyProfileGuard = require("../middlewares/profileGuard.middleware");
const job = require("../controllers/job.controller");

// company
router.post("/jobs", auth, companyProfileGuard, job.createJob);
router.get("/company/jobs", auth, job.getCompanyJobs);

// candidate
router.get("/jobs", auth, job.getActiveJobs);

module.exports = router;
