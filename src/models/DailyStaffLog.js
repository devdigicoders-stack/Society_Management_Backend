const mongoose = require("mongoose");

const dailyStaffLogSchema = new mongoose.Schema({

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    dailyStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyStaff",
      required: true,
    },

    guard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flatOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    entryTime: {
      type: Date,
      default: null,
    },

    exitTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ENTERED", "EXITED"],
      default: "ENTERED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyStaffLog", dailyStaffLogSchema);