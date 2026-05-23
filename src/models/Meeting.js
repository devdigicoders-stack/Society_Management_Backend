const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
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

    meetingDate: {
      type: Date,
      required: true,
    },

    meetingTime: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    agenda: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);