const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const reviewController = require("../controllers/review.controller");

router.post("/", auth, reviewController.addReview);
router.get("/:companyId", reviewController.getCompanyReviews);

module.exports = router;
