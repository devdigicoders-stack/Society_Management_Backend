const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      flatOwner: req.user._id,
      service: req.body.service,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      address: req.body.address,
      address: req.body.address,
      notes: req.body.notes,
      societyId: req.user.societyId,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      flatOwner: req.user._id,
      societyId: req.user.societyId,
    })
      .populate("service", "serviceName category price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ societyId: req.user.societyId })
      .populate("flatOwner", "name phone email")
      .populate("service", "serviceName category price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.assignServiceProvider = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      {
        assignedProvider: req.body.assignedProvider,
        status: "ASSIGNED",
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service provider assigned successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, societyId: req.user.societyId },
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};