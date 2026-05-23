const Meeting = require("../models/Meeting");

exports.createMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.create({
      title: req.body.title,
      description: req.body.description,
      meetingDate: req.body.meetingDate,
      meetingTime: req.body.meetingTime,
      location: req.body.location,
      agenda: req.body.agenda,
      createdBy: req.user._id,
      societyId: req.user.societyId,
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ isActive: true, societyId: req.user.societyId })
      .populate("createdBy", "name role")
      .sort({ meetingDate: 1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      {
        title: req.body.title,
        description: req.body.description,
        meetingDate: req.body.meetingDate,
        meetingTime: req.body.meetingTime,
        location: req.body.location,
        agenda: req.body.agenda,
      },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      { isActive: false },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};