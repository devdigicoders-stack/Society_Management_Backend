const Guard = require("../models/Guard");

exports.createGuardProfile = async (req, res) => {
  try {
    const existingProfile = await Guard.findOne({ user: req.user._id });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Guard profile already exists",
      });
    }

    const guard = await Guard.create({
      user: req.user._id,
      societyName: req.body.societyName,
      shift: req.body.shift,
      gateNumber: req.body.gateNumber,
    });

    res.status(201).json({
      success: true,
      message: "Guard profile created successfully",
      data: guard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyGuardProfile = async (req, res) => {
  try {
    const guard = await Guard.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone role"
    );

    res.status(200).json({
      success: true,
      data: guard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllGuards = async (req, res) => {
  try {
    const guards = await Guard.find()
      .populate("user", "name email phone role isApproved isBlocked")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guards.length,
      data: guards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};