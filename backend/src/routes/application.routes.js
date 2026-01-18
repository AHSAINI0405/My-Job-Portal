const router = require("express").Router();
const protect = require("../middlewares/auth.middleware");
const applicationController = require("../controllers/application.controller");

// Apply to job
router.post(
  "/jobs/:jobId/apply",
  protect,
  applicationController.applyToJob
);

// User applied jobs
router.get(
  "/applications/me",
  protect,
  applicationController.getAppliedJobs
);

// Company view applicants
router.get(
  "/company/jobs/:jobId/applicants",
  protect,
  applicationController.getApplicantsForJob
);

// Shortlist
router.patch(
  "/applications/:id/shortlist",
  protect,
  applicationController.shortlistCandidate
);

// Reject
router.patch(
  "/applications/:id/reject",
  protect,
  applicationController.rejectCandidate
);

module.exports = router;