

const express = require('express');
const router = express.Router();

const {
  addFeedback,
  getFeedbackForTechnician,
  getMyFeedback,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedback.controller');

const { employeeAuth } = require('../middlewares/auth.middleware');

router.post('/add', employeeAuth, addFeedback);
router.get('/technician/:id', getFeedbackForTechnician);  
router.get('/mine', employeeAuth, getMyFeedback);
router.put('/:id', employeeAuth, updateFeedback);
router.delete('/:id', employeeAuth, deleteFeedback);

module.exports = router;
