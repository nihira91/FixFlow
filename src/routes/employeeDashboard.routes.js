
const express = require("express");
const router = express.Router();

const { employeeAuthCheck } = require("../middlewares/employeeAuthCheck");
const {
  getEmployeeDashboardStats,
} = require("../controllers/employeeDashboard.controller");

router.get("/stats", employeeAuthCheck, getEmployeeDashboardStats);

module.exports = router;
