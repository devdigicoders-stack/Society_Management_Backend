const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  assignServiceProvider,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("FLAT_OWNER"), createAppointment);

router.get("/my", protect, authorize("FLAT_OWNER"), getMyAppointments);

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  getAllAppointments
);

router.patch(
  "/:id/assign-provider",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  assignServiceProvider
);

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  updateAppointmentStatus
);

module.exports = router;