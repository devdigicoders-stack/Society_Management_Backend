const mongoose = require("mongoose");

const dailyStaffSchema = new mongoose.Schema(
  {
    flatOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    staffName: {
      type: String,
      required: true,
      trim: true,
    },

    staffPhone: {
      type: String,
      required: true,
      trim: true,
    },

    staffType: {
      type: String,
      enum: ["MAID", "DRIVER", "COOK", "CLEANER", "MILKMAN", "NEWSPAPER", "OTHER"],
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    allowedDays: [
      {
        type: String,
        enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      },
    ],

    entryTime: {
      type: String,
      default: "",
    },

    exitTime: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyStaff", dailyStaffSchema);