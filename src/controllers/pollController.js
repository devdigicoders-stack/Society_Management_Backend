const Poll = require("../models/Poll");

exports.createPoll = async (req, res) => {
  try {
    const options = req.body.options.map((option) => ({
      text: option,
      votes: [],
    }));

    const poll = await Poll.create({
      question: req.body.question,
      options,
      createdBy: req.user._id,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      societyId: req.user.societyId,
    });

    res.status(201).json({
      success: true,
      message: "Poll created successfully",
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true, societyId: req.user.societyId })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: polls.length,
      data: polls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;

    const poll = await Poll.findOne({ _id: req.params.id, societyId: req.user.societyId });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const now = new Date();

    if (now < poll.startDate || now > poll.endDate) {
      return res.status(400).json({
        success: false,
        message: "Poll is not active currently",
      });
    }

    const alreadyVoted = poll.options.some((option) =>
      option.votes.includes(req.user._id)
    );

    if (alreadyVoted) {
      return res.status(400).json({
        success: false,
        message: "You have already voted",
      });
    }

    const selectedOption = poll.options.id(optionId);

    if (!selectedOption) {
      return res.status(404).json({
        success: false,
        message: "Option not found",
      });
    }

    selectedOption.votes.push(req.user._id);

    await poll.save();

    res.status(200).json({
      success: true,
      message: "Vote submitted successfully",
      data: poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPollResult = async (req, res) => {
  try {
    const poll = await Poll.findOne({ _id: req.params.id, societyId: req.user.societyId }).populate(
      "createdBy",
      "name role"
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const result = poll.options.map((option) => ({
      optionId: option._id,
      text: option.text,
      totalVotes: option.votes.length,
    }));

    res.status(200).json({
      success: true,
      question: poll.question,
      totalVotes: result.reduce((sum, item) => sum + item.totalVotes, 0),
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      { isActive: false },
      { new: true }
    );

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Poll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};