const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { bookAppointment } = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getDoctorQueue } = require("../controllers/appointmentController");
const { getAdminStats } = require("../controllers/appointmentController");

// Patient books appointment
router.post(
  "/",
  protect,
  authorize("patient"),
  bookAppointment
);

// Doctor views own queue
router.get(
  "/doctor/queue",
  protect,
  authorize("doctor"),
  getDoctorQueue
);

const { completeAppointment } = require("../controllers/appointmentController");

// Doctor completes appointment
router.put(
  "/:id/complete",
  protect,
  authorize("doctor"),
  completeAppointment
);

router.get("/patient", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    }).populate("doctor", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // only patient can cancel their own appointment
    if (appt.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appt.status = "cancelled";
    await appt.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/queue/:id", protect, async (req, res) => {
  try {
    const currentAppt = await Appointment.findById(req.params.id);

    if (!currentAppt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const queue = await Appointment.find({
      doctor: currentAppt.doctor,
      appointmentDate: currentAppt.appointmentDate,
      status: "booked",
    }).sort({ isEmergency: -1, createdAt: 1 });

    const position =
      queue.findIndex(
        (appt) => appt._id.toString() === req.params.id
      ) + 1;

    res.json({ position });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/admin/stats",
  protect,
  authorize("admin"),
  getAdminStats
);

module.exports = router;
