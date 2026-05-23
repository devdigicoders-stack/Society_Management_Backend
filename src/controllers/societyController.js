const Society = require("../models/Society");

exports.createSociety = async (req, res) => {
  try {
    const { name, address, registrationNumber, contactEmail, contactPhone } = req.body;

    const newSociety = await Society.create({
      name,
      address,
      registrationNumber,
      contactEmail,
      contactPhone,
    });

    res.status(201).json({
      success: true,
      data: newSociety,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find({});

    res.status(200).json({
      success: true,
      count: societies.length,
      data: societies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found",
      });
    }

    res.status(200).json({
      success: true,
      data: society,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found",
      });
    }

    res.status(200).json({
      success: true,
      data: society,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found",
      });
    }

    await society.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
