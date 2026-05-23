const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      flatOwner: req.user._id,
      societyId: req.user.societyId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      attachments: req.body.attachments,
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      flatOwner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      societyId: req.user.societyId,
    })
      .populate("flatOwner", "name phone email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {

    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      {
        status: req.body.status,
        adminComment: req.body.adminComment,
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};