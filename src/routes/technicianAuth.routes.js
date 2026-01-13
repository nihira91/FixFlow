const express = require("express");
const router = express.Router();

const {
  signupTechnician,
  loginTechnician,
  getTechnicianProfile,
  completeProfile
} = require("../controllers/technicianAuth.controller");

const {
  verifyToken,
  technicianAuthCheck
} = require("../middlewares/technicianAuthCheck");

// ===============================
// Technician Signup (Basic Info Only)
// ===============================
router.post("/signup", signupTechnician);

// ===============================
// Technician Profile Completion
// ===============================
router.post(
  "/complete-profile",
  verifyToken,
  technicianAuthCheck("technician"),
  completeProfile
);

// ===============================
// Technician Login
// ===============================
router.post("/login", loginTechnician);

// ===============================
// Technician Profile (Get)
// ===============================
router.get(
  "/profile",
  verifyToken,
  technicianAuthCheck("technician"),
  getTechnicianProfile
);

module.exports = router;
