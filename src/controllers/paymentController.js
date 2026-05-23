const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/Payment");
const MaintenanceDue = require("../models/MaintenanceDue");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const due = await MaintenanceDue.findOne({
      _id: req.body.maintenanceDue,
      flatOwner: req.user._id,
      status: "PENDING",
      societyId: req.user.societyId,
    });

    if (!due) {
      return res.status(404).json({
        success: false,
        message: "Pending maintenance due not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: due.amount * 100,
      currency: "INR",
      receipt: `receipt_${due._id}`,
    });

    const payment = await Payment.create({
      flatOwner: req.user._id,
      maintenanceDue: due._id,
      razorpayOrderId: order.id,
      amount: due.amount,
      societyId: req.user.societyId,
    });

    res.status(201).json({
      success: true,
      message: "Payment order created",
      key: process.env.RAZORPAY_KEY_ID,
      order,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, societyId: req.user.societyId },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "PAID",
      },
      { new: true }
    );

    await MaintenanceDue.findOneAndUpdate({ _id: payment.maintenanceDue, societyId: req.user.societyId }, {
      status: "PAID",
      paymentMode: "ONLINE",
      paidAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ flatOwner: req.user._id, societyId: req.user.societyId })
      .populate("maintenanceDue", "month year amount status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};