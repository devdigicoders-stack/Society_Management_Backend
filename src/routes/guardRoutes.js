const express = require("express");

const {
  createGuardProfile,
  getMyGuardProfile,
  getAllGuards,
} = require("../controllers/guardController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/profile", protect, authorize("GUARD"), createGuardProfile);

router.get("/profile/me", protect, authorize("GUARD"), getMyGuardProfile);

router.get("/", protect, authorize("SUPER_ADMIN", "MANAGER"), getAllGuards);

module.exports = router;