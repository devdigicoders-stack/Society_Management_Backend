const express = require("express");

const {
  createDailyStaff,
  getMyDailyStaff,
  getAllDailyStaff,
  blockDailyStaff,
  unblockDailyStaff,
  markDailyStaffEntry,
  markDailyStaffExit,
  getDailyStaffLogs,
} = require("../controllers/dailyStaffController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("FLAT_OWNER"), createDailyStaff);

router.get("/my-staff", protect, authorize("FLAT_OWNER"), getMyDailyStaff);

router.get("/", protect, authorize("SUPER_ADMIN", "MANAGER"), getAllDailyStaff);

router.patch("/:id/block", protect, authorize("FLAT_OWNER"), blockDailyStaff);

router.patch("/:id/unblock", protect, authorize("FLAT_OWNER"), unblockDailyStaff);

router.patch("/:id/entry", protect, authorize("GUARD"), markDailyStaffEntry);

router.patch("/:id/exit", protect, authorize("GUARD"), markDailyStaffExit);

router.get(
  "/logs/history",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  getDailyStaffLogs
);

module.exports = router;