const express = require("express");
const router = express.Router();

const {
  signupTechnician,
  loginTechnician,
  getTechnicianProfile
} = require("../controllers/technicianAuth.controller");

const {
  verifyToken,
  technicianAuthCheck
} = require("../middlewares/technicianAuthCheck");

// ===============================
// Technician Signup
// ===============================
router.post("/signup", signupTechnician);

// ===============================
// Technician Login
// ===============================
router.post("/login", loginTechnician);

// ===============================
// Technician Profile
// ===============================
router.get(
  "/profile",
  verifyToken,
  technicianAuthCheck("technician"),
  getTechnicianProfile
);

module.exports = router;
