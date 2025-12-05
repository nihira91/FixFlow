// src/routes/employeeIssue.routes.js

const express = require('express');
const router = express.Router();

const {
  createIssue,
  getEmployeeIssues,
  getSingleIssue
} = require('../controllers/employeeIssue.controller');

const { employeeAuthCheck } = require('../middleware/employeeAuthCheck');

// Create new issue
router.post('/issue/create', employeeAuthCheck, createIssue);

// Get all issues of logged-in employee
router.get('/issues', employeeAuthCheck, getEmployeeIssues);

// Get details of a specific issue
router.get('/issue/:id', employeeAuthCheck, getSingleIssue);

module.exports = router;
