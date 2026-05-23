const express = require("express");

const {
  createMaintenanceDue,
  getMyMaintenanceDues,
  getAllMaintenanceDues,
  markMaintenancePaid,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  createMaintenanceDue
);

router.get(
  "/my-dues",
  protect,
  authorize("FLAT_OWNER"),
  getMyMaintenanceDues
);

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  getAllMaintenanceDues
);

router.patch(
  "/:id/mark-paid",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  markMaintenancePaid
);

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  updateMaintenanceStatus
);

module.exports = router;