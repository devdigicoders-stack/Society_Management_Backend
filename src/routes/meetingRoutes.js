const express = require("express");

const {
  createMeeting,
  getAllMeetings,
  updateMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  createMeeting
);

router.get("/", protect, getAllMeetings);

router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  updateMeeting
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  deleteMeeting
);

module.exports = router;