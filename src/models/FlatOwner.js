const mongoose = require("mongoose");

const flatOwnerSchema = new mongoose.Schema(
  {
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

    tower: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: String,
      required: true,
      trim: true,
    },

    flatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    familyMembers: {
      type: Number,
      default: 0,
    },

    vehicleNumbers: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlatOwner", flatOwnerSchema);