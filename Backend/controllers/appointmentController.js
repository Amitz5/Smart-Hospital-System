const Appointment = require("../models/Appointment");

// BOOK APPOINTMENT (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot, isEmergency } = req.body;

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctor,
      appointmentDate,
      timeSlot,
      isEmergency: isEmergency || false,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET DOCTOR QUEUE (Doctor)
exports.getDoctorQueue = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["booked", "in-queue"] },
    })
      .sort({ isEmergency: -1, createdAt: 1 })
      .populate("patient", "name");

    const queue = appointments.map((appt, index) => ({
      appointmentId: appt._id,
      patientName: appt.patient.name,
      timeSlot: appt.timeSlot,
      isEmergency: appt.isEmergency,
      estimatedWaitTime: index * 15, // minutes
    }));

    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MARK APPOINTMENT AS COMPLETED (Doctor)
exports.completeAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ensure doctor is completing only their own appointment
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.json({ message: "Appointment marked as completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN DASHBOARD ANALYTICS
exports.getAdminStats = async (req, res) => {
  try {
    const { range } = req.query;

    let startDate = new Date();

    if (range === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      // default = today
      startDate.setHours(0, 0, 0, 0);
    }

    const filter = {
      createdAt: { $gte: startDate },
    };

    const total = await Appointment.countDocuments(filter);
    const booked = await Appointment.countDocuments({ ...filter, status: "booked" });
    const completed = await Appointment.countDocuments({ ...filter, status: "completed" });
    const cancelled = await Appointment.countDocuments({ ...filter, status: "cancelled" });
    const emergency = await Appointment.countDocuments({ ...filter, isEmergency: true });

    res.json({
      total,
      booked,
      completed,
      cancelled,
      emergency,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  } 
};
