const mongoose = require("mongoose");

const maintenanceDueSchema = new mongoose.Schema({

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

    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE"],
      default: "PENDING",
    },

    paymentMode: {
      type: String,
      enum: ["ONLINE", "CASH", "NONE"],
      default: "NONE",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceDue", maintenanceDueSchema);