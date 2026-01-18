const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const aiCtrl = require("../controllers/ai.controller");

/**
 * POST /ai/analyze
 */
router.post("/ai/analyze", auth, aiCtrl.analyzeResume);

module.exports = router;
