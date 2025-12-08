
const express = require("express");
const router = express.Router();

const {employeeAuthCheck} = require("../middleware/employeeAuthCheck");
const {
  getEmployeeNotifications,
  markAllAsRead,
  markOneAsRead,
} = require("../controllers/employeeNotification.controller");

// GET all notifications
router.get("/", employeeAuthCheck, getEmployeeNotifications);

// Mark all as read
router.put("/read-all", employeeAuthCheck, markAllAsRead);

// Mark one as read
router.put("/read/:id", employeeAuthCheck, markOneAsRead);

module.exports = router;