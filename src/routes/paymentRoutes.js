const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/create-order",
  protect,
  authorize("FLAT_OWNER"),
  createPaymentOrder
);

router.post(
  "/verify",
  protect,
  authorize("FLAT_OWNER"),
  verifyPayment
);

router.get(
  "/my-payments",
  protect,
  authorize("FLAT_OWNER"),
  getMyPayments
);

module.exports = router;