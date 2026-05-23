const mongoose = require("mongoose");

const guardSchema = new mongoose.Schema({

    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    societyName: {
      type: String,
      required: true,
      trim: true,
    },

    shift: {
      type: String,
      enum: ["MORNING", "EVENING", "NIGHT"],
      required: true,
    },

    gateNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guard", guardSchema);