const FlatOwner = require("../models/FlatOwner");

exports.createFlatOwnerProfile = async (req, res) => {
  try {
    const existingProfile = await FlatOwner.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Flat owner profile already exists",
      });
    }

    const profile = await FlatOwner.create({
      user: req.user._id,
      societyName: req.body.societyName,
      tower: req.body.tower,
      floor: req.body.floor,
      flatNumber: req.body.flatNumber,
      familyMembers: req.body.familyMembers,
      vehicleNumbers: req.body.vehicleNumbers,
    });

    res.status(201).json({
      success: true,
      message: "Flat owner profile created",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyFlatOwnerProfile = async (req, res) => {
  try {
    const profile = await FlatOwner.findOne({
      user: req.user._id,
    }).populate("user", "name email phone role");

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllFlatOwners = async (req, res) => {
  try {
    const profiles = await FlatOwner.find()
      .populate("user", "name email phone role isApproved isBlocked")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};