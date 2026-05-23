const express = require("express");
const {
  createFlatOwnerProfile,
  getMyFlatOwnerProfile,
  getAllFlatOwners,
} = require("../controllers/flatOwnerController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/profile",
  protect,
  authorize("FLAT_OWNER"),
  createFlatOwnerProfile
);

router.get(
  "/profile/me",
  protect,
  authorize("FLAT_OWNER"),
  getMyFlatOwnerProfile
);

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  getAllFlatOwners
);

module.exports = router;