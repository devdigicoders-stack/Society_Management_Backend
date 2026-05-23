const express = require("express");

const {
  createGuestEntry,
  getMyGuestRequests,
  approveGuest,
  rejectGuest,
  markGuestEntered,
  markGuestExited,
  getAllGuestHistory,
} = require("../controllers/guestController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("GUARD"), createGuestEntry);

router.get("/my-requests", protect, authorize("FLAT_OWNER"), getMyGuestRequests);

router.patch("/:id/approve", protect, authorize("FLAT_OWNER"), approveGuest);

router.patch("/:id/reject", protect, authorize("FLAT_OWNER"), rejectGuest);

router.patch("/:id/entry", protect, authorize("GUARD"), markGuestEntered);

router.patch("/:id/exit", protect, authorize("GUARD"), markGuestExited);

router.get("/history", protect, authorize("SUPER_ADMIN", "MANAGER"), getAllGuestHistory);

module.exports = router;