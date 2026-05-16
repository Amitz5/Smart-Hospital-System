const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "in-queue", "completed", "cancelled"],
      default: "booked",
    },

    isEmergency: {
      type: Boolean,
      default: false,
    },

    // ✅ PRESCRIPTION FEATURE
    prescription: {
      medicines: {
        type: String,
        default: "",
      },

      diagnosis: {
        type: String,
        default: "",
      },

      advice: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", "appointmentSchema");