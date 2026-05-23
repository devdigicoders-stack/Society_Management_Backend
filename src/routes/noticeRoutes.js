const express = require("express");

const {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  createNotice
);

router.get("/", protect, getAllNotices);

router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  updateNotice
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  deleteNotice
);

module.exports = router;