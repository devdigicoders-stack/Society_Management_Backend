const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { protect, authorize } = require("./middlewares/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const flatOwnerRoutes = require("./routes/flatOwnerRoutes");
const guardRoutes = require("./routes/guardRoutes");
const guestRoutes = require("./routes/guestRoutes");
const dailyStaffRoutes = require("./routes/dailyStaffRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const pollRoutes = require("./routes/pollRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const societyRoutes = require("./routes/societyRoutes");



const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
});

app.use(limiter);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Society Portal API Running",
  });
});

app.get(
  "/api/test/super-admin",
  protect,
  authorize("SUPER_ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Super Admin",
      user: req.user,
    });
  }
);

// Route Handlers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flat-owners", flatOwnerRoutes);
app.use("/api/guards", guardRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/daily-staff", dailyStaffRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/uploads", uploadRoutes);
app.use("/api/societies", societyRoutes);

module.exports = app;
