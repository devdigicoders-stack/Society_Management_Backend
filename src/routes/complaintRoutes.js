const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("FLAT_OWNER"), createComplaint);

router.get("/my", protect, authorize("FLAT_OWNER"), getMyComplaints);

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  getAllComplaints
);

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  updateComplaintStatus
);

module.exports = router;