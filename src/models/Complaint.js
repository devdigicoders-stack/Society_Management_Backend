const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "ELECTRICITY",
        "WATER",
        "SECURITY",
        "CLEANING",
        "PARKING",
        "LIFT",
        "OTHER",
      ],
      required: true,
    },

    attachments: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "OPEN",
    },

    adminComment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);