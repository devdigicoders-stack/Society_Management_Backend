const MaintenanceDue = require("../models/MaintenanceDue");

exports.createMaintenanceDue = async (req, res) => {
  try {
    const due = await MaintenanceDue.create({
      flatOwner: req.body.flatOwner,
      month: req.body.month,
      year: req.body.year,
      amount: req.body.amount,
      dueDate: req.body.dueDate,
      createdBy: req.user._id,
      societyId: req.user.societyId,
    });

    res.status(201).json({
      success: true,
      message: "Maintenance due created successfully",
      data: due,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyMaintenanceDues = async (req, res) => {
  try {
    const dues = await MaintenanceDue.find({
      flatOwner: req.user._id,
      societyId: req.user.societyId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dues.length,
      data: dues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllMaintenanceDues = async (req, res) => {
  try {
    const dues = await MaintenanceDue.find({ societyId: req.user.societyId })
      .populate("flatOwner", "name phone email role")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dues.length,
      data: dues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markMaintenancePaid = async (req, res) => {
  try {
    const due = await MaintenanceDue.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      {
        status: "PAID",
        paymentMode: req.body.paymentMode || "CASH",
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!due) {
      return res.status(404).json({
        success: false,
        message: "Maintenance due not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance marked as paid",
      data: due,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const due = await MaintenanceDue.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!due) {
      return res.status(404).json({
        success: false,
        message: "Maintenance due not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance status updated successfully",
      data: due,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};