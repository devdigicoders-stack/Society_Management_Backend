const DailyStaff = require("../models/DailyStaff");
const DailyStaffLog = require("../models/DailyStaffLog");

exports.createDailyStaff = async (req, res) => {
  try {
    const staff = await DailyStaff.create({
      flatOwner: req.user._id,
      staffName: req.body.staffName,
      staffPhone: req.body.staffPhone,
      staffType: req.body.staffType,
      photo: req.body.photo,
      allowedDays: req.body.allowedDays,
      entryTime: req.body.entryTime,
      exitTime: req.body.exitTime,
    });

    res.status(201).json({
      success: true,
      message: "Daily staff registered successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyDailyStaff = async (req, res) => {
  try {
    const staff = await DailyStaff.find({ flatOwner: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllDailyStaff = async (req, res) => {
  try {
    const staff = await DailyStaff.find()
      .populate("flatOwner", "name phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.blockDailyStaff = async (req, res) => {
  try {
    const staff = await DailyStaff.findOneAndUpdate(
      {
        _id: req.params.id,
        flatOwner: req.user._id,
      },
      { isBlocked: true },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Daily staff not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Daily staff blocked successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unblockDailyStaff = async (req, res) => {
  try {
    const staff = await DailyStaff.findOneAndUpdate(
      {
        _id: req.params.id,
        flatOwner: req.user._id,
      },
      { isBlocked: false },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Daily staff not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Daily staff unblocked successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.markDailyStaffEntry = async (req, res) => {
  try {
    const staff = await DailyStaff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Daily staff not found",
      });
    }

    if (staff.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Daily staff is blocked by flat owner",
      });
    }

    const alreadyEntered = await DailyStaffLog.findOne({
      dailyStaff: staff._id,
      status: "ENTERED",
    });

    if (alreadyEntered) {
      return res.status(400).json({
        success: false,
        message: "Daily staff already entered and not exited yet",
      });
    }

    const log = await DailyStaffLog.create({
      dailyStaff: staff._id,
      guard: req.user._id,
      flatOwner: staff.flatOwner,
      entryTime: new Date(),
      status: "ENTERED",
    });

    res.status(201).json({
      success: true,
      message: "Daily staff entry marked successfully",
      data: log,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markDailyStaffExit = async (req, res) => {
  try {

    const log = await DailyStaffLog.findOneAndUpdate(
      {
        dailyStaff: req.params.id,
        status: "ENTERED",
      },
      {
        exitTime: new Date(),
        status: "EXITED",
      },
      { new: true }
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Active entry log not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Daily staff exit marked successfully",
      data: log,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDailyStaffLogs = async (req, res) => {
  try {

    const logs = await DailyStaffLog.find()
      .populate("dailyStaff", "staffName staffPhone staffType photo")
      .populate("guard", "name phone role")
      .populate("flatOwner", "name phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};