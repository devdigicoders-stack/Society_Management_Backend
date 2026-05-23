const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ societyId: req.user.societyId }).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User approved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Block user
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      { isBlocked: true },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unblock user
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      { isBlocked: false },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};