/**
 * Issue Completion & Rating Routes
 * Handle marking issues as complete and rating technicians
 */

const express = require('express');
const router = express.Router();
const completionController = require('../controllers/completion.controller');
const authMiddleware = require('../middlewares/authmiddleware');

// ✅ MARK ISSUE AS COMPLETE (Technician)
router.patch(
  '/mark-complete/:issueId',
  authMiddleware,
  completionController.markIssueComplete
);

// ⭐ RATE TECHNICIAN (Employee)
router.post(
  '/rate-technician/:issueId',
  authMiddleware,
  completionController.rateTechnician
);

// 📊 GET ISSUE RATING
router.get(
  '/rating/:issueId',
  authMiddleware,
  completionController.getIssueRating
);

// 🏆 GET TECHNICIAN AVERAGE RATING
router.get(
  '/technician-rating/:technicianId',
  authMiddleware,
  completionController.getTechnicianAverageRating
);

module.exports = router;
