
const express = require("express");
const router = express.Router();

const { employeeAuthCheck } = require("../middleware/employeeAuthCheck");
const {
  getEmployeeNotifications,
  markAllAsRead,
} = require("../controllers/employeeNotification.controller");

router.get("/", employeeAuthCheck, getEmployeeNotifications);

router.put("/mark-read", employeeAuthCheck, markAllAsRead);

module.exports = router;
