const Notice = require("../models/Notice");

exports.createNotice = async (req, res) => {
  try {

    const notice = await Notice.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      attachments: req.body.attachments,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllNotices = async (req, res) => {
  try {

    const notices = await Notice.find({ isActive: true })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateNotice = async (req, res) => {
  try {

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        attachments: req.body.attachments,
      },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNotice = async (req, res) => {
  try {

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};