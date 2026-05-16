const Appointment = require("../models/Appointment");

//get available slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;

    const ALL_SLOTS = [
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 01:00 PM",
      "01:00 PM - 02:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
    ];

    const selectedDate = new Date(date);

    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookedAppointments = await Appointment.find({
      doctor,
      appointmentDate: {
        $gte: selectedDate,
        $lt: nextDay,
      },
      status: {
        $ne: "cancelled",
      },
    });

    const occupiedSlots = bookedAppointments.map(
      (appt) => appt.timeSlot
    );

    const availableSlots = ALL_SLOTS.filter(
      (slot) => !occupiedSlots.includes(slot)
    );

    res.json({ availableSlots });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BOOK APPOINTMENT (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot, isEmergency } = req.body;

    // ✅ Prevent past date booking
    const selectedDate = new Date(appointmentDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot book appointment for past dates",
      });
    }

      const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Time slot already booked",
      });
    }
    
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

    // TODAY + FUTURE APPOINTMENTS
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: today },
      status: { $in: ["booked", "in-queue"] },
    })
      .sort({
        appointmentDate: 1,
        isEmergency: -1,
        createdAt: 1,
      })
      .populate("patient", "name");

    const queue = appointments.map((appt, index) => ({
      appointmentId: appt._id,
      patientName: appt.patient.name,
      timeSlot: appt.timeSlot,
      appointmentDate: appt.appointmentDate,
      isEmergency: appt.isEmergency,
      estimatedWaitTime: index * 15,
    }));

    res.json(queue);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// MARK APPOINTMENT AS COMPLETED (Doctor)
exports.completeAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const { medicines, diagnosis, advice } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized action",
      });
    }

    appointment.status = "completed";

    appointment.prescription = {
      medicines,
      diagnosis,
      advice,
    };

    await appointment.save();

    res.json({
      message: "Appointment completed with prescription",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
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
