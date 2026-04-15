const express = require("express");
const { register, login, registerDoctor } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { sendOtp } = require("../controllers/authController");
const { verifyOtp } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.post(
  "/create-doctor",
  protect,
  authorize("admin"),
  registerDoctor
);

module.exports = router;