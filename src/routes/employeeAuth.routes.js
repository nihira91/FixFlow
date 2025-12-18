const express = require("express");
const router = express.Router();

const {
  signupEmployee,
  loginEmployee,
  getEmployeeProfile
} = require("../controllers/employeeAuth.controller");

const { employeeAuthCheck } = require("../middlewares/employeeAuthCheck");

// ===============================
// Employee Signup
// ===============================
router.post("/signup", signupEmployee);

// ===============================
// Employee Login
// ===============================
router.post("/login", loginEmployee);

// ===============================
// Employee Profile
// ===============================
router.get("/profile", employeeAuthCheck, getEmployeeProfile);

module.exports = router;
