const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const emailCtrl = require("../controllers/email.controller");

/**
 * POST /company/email
 * Company sends mail to candidate
 */
router.post(
  "/company/email",
  auth,
  emailCtrl.emailCandidate
);

module.exports = router;
