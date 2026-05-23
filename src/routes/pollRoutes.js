const express = require("express");

const {
  createPoll,
  getAllPolls,
  votePoll,
  getPollResult,
  deletePoll,
} = require("../controllers/pollController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  createPoll
);

router.get("/", protect, getAllPolls);

router.post(
  "/:id/vote",
  protect,
  authorize("FLAT_OWNER"),
  votePoll
);

router.get(
  "/:id/result",
  protect,
  getPollResult
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  deletePoll
);

module.exports = router;