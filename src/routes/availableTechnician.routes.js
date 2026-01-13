// src/routes/availableTechnician.routes.js
const express = require("express");
const router = express.Router();

const {
  getAvailableTechnicians,
  getAllTechnicians,
  getTechnicianStats
} = require("../controllers/availableTechnician.controller");

const { verifyToken } = require("../middlewares/technicianAuthCheck");

/**
 * Get available technicians for a specific category
 * Usage: GET /api/technicians/available?category=Electrical
 */
router.get("/available", getAvailableTechnicians);

/**
 * Get all technicians (admin view)
 * Usage: GET /api/technicians/all
 */
router.get("/all", verifyToken, getAllTechnicians);

/**
 * Get technician statistics by category (admin view)
 * Usage: GET /api/technicians/stats
 */
router.get("/stats", verifyToken, getTechnicianStats);

module.exports = router;
