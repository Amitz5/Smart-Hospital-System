const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://smart-hospital-system-sigma.vercel.app"],
}));
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes.js"));

// Test route
const { protect, authorize } = require("./middleware/authMiddleware");

app.get(
  "/api/test/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

app.get("/", (req, res) => {
  res.send("Smart Healthcare Backend Running");
});


// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
