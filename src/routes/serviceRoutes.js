const express = require("express");

const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  createService
);

router.get("/", protect, getAllServices);

router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  updateService
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  deleteService
);

module.exports = router;