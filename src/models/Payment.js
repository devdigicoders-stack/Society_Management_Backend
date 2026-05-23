const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    flatOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    maintenanceDue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceDue",
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["CREATED", "PAID", "FAILED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);