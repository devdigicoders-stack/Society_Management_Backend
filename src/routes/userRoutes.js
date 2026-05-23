const express = require("express");
const {
  getAllUsers,
  approveUser,
  blockUser,
  unblockUser,
} = require("../controllers/userController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("SUPER_ADMIN"), getAllUsers);

router.patch("/:id/approve", protect, authorize("SUPER_ADMIN"), approveUser);

router.patch("/:id/block", protect, authorize("SUPER_ADMIN"), blockUser);

router.patch("/:id/unblock", protect, authorize("SUPER_ADMIN"), unblockUser);

module.exports = router;