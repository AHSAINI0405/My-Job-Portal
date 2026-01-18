const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const search = require("../controllers/search.controller");

/**
 * Candidate job search
 * GET /search/jobs?keyword=react
 */
router.get("/search/jobs", auth, search.searchJobs);

/**
 * Company candidate search
 * GET /search/candidates?keyword=mern
 */
router.get("/search/candidates", auth, search.searchCandidates);

module.exports = router;
