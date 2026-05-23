const Guest = require("../models/Guest");

exports.createGuestEntry = async (req, res) => {
  try {
    const guest = await Guest.create({
      guard: req.user._id,
      flatOwner: req.body.flatOwner,
      guestName: req.body.guestName,
      guestPhone: req.body.guestPhone,
      purpose: req.body.purpose,
      vehicleNumber: req.body.vehicleNumber,
      photo: req.body.photo,
      societyId: req.user.societyId,
    });

    res.status(201).json({
      success: true,
      message: "Guest entry sent for approval",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyGuestRequests = async (req, res) => {
  try {
    const guests = await Guest.find({ flatOwner: req.user._id, societyId: req.user.societyId })
      .populate("guard", "name phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guests.length,
      data: guests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveGuest = async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      {
        _id: req.params.id,
        flatOwner: req.user._id,
        societyId: req.user.societyId,
      },
      {
        status: "APPROVED",
      },
      { new: true }
    );

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guest approved successfully",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectGuest = async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      {
        _id: req.params.id,
        flatOwner: req.user._id,
        societyId: req.user.societyId,
      },
      {
        status: "REJECTED",
      },
      { new: true }
    );

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guest rejected successfully",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markGuestEntered = async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      {
        _id: req.params.id,
        guard: req.user._id,
        status: "APPROVED",
        societyId: req.user.societyId,
      },
      {
        status: "ENTERED",
        entryTime: new Date(),
      },
      { new: true }
    );

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Approved guest not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guest entry marked successfully",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markGuestExited = async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      {
        _id: req.params.id,
        guard: req.user._id,
        status: "ENTERED",
        societyId: req.user.societyId,
      },
      {
        status: "EXITED",
        exitTime: new Date(),
      },
      { new: true }
    );

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Entered guest not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guest exit marked successfully",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllGuestHistory = async (req, res) => {
  try {
    const guests = await Guest.find({ societyId: req.user.societyId })
      .populate("guard", "name phone role")
      .populate("flatOwner", "name phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guests.length,
      data: guests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};