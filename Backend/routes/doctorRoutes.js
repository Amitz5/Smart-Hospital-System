const express = require("express")
const User = require("../models/User.js");

const router = express.Router();

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("_id name email");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
