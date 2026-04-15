const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpStore = {};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//OTP
// exports.sendOtp = async (req, res) => {
//   const { email } = req.body;

//   const otp = Math.floor(100000 + Math.random() * 900000);

//   otpStore[email] = otp;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     to: email,
//     subject: "OTP Verification",
//     text: `Your OTP is ${otp}`,
//   });

//   res.json({ message: "OTP sent successfully" });
// };

//verify OTP
// exports.verifyOtp = async (req, res) => {
//   const { name, email, password, otp } = req.body;

//   if (otpStore[email] != otp) {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }

// const hashedPassword = await bcrypt.hash(password, 10);

// const user = await User.create({
//   name,
//   email,
//   password: hashedPassword,
//   role: "patient",
// });

//   delete otpStore[email];

//   res.json({ message: "User registered successfully" });
// };

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    res.status(201).json({ message: "Doctor created successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
