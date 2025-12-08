// src/routes/employeeComment.routes.js

const express = require('express');
const router = express.Router();

const {
  addComment,
  getIssueComments
} = require('../controllers/employeeComment.controller');

const { employeeAuthCheck } = require('../middleware/employeeAuthCheck');

// Add comment to issue
router.post('/issue/:id/comment', employeeAuthCheck, addComment);

// Get comments for issue
router.get('/issue/:id/comments', employeeAuthCheck, getIssueComments);

module.exports = router;
