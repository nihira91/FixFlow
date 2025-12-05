

const express = require('express');
const router = express.Router();

const {
  calculateSLAForIssue,
  getTechnicianSLAReport,
  getDepartmentSLAReport
} = require('../controllers/sla.controller');

const { adminAuth, technicianAuth } = require('../middlewares/auth.middleware');

router.get('/issue/:id', calculateSLAForIssue);

router.get('/technician/:id', technicianAuth, getTechnicianSLAReport);
router.get('/department/:name', adminAuth, getDepartmentSLAReport);

module.exports = router;
