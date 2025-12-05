

const express = require('express');
const router = express.Router();

const {
  getTechnicianStats,
  getLeaderboard,
  getRatingBreakdown
} = require('../controllers/stats.controller');

router.get('/technician/:id', getTechnicianStats);
router.get('/leaderboard', getLeaderboard);
router.get('/rating-breakdown/:id', getRatingBreakdown);

module.exports = router;
