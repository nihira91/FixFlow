// // src/routes/employeeAuth.routes.js

// const express = require('express');
// const router = express.Router();

// const {
//   loginEmployee,
//   getEmployeeProfile
// } = require('../controllers/employeeAuth.controller');

// const { employeeAuthCheck } = require('../middleware/employeeAuthCheck');

// // Employee Login
// router.post('/login', loginEmployee);

// // Get logged-in employee profile
// router.get('/profile', employeeAuthCheck, getEmployeeProfile);

// module.exports = router;

// src/routes/employeeAuth.routes.js

const express = require('express');
const router = express.Router();

const {
  loginEmployee,
  getEmployeeProfile
} = require('../controllers/employeeAuth.controller');

const { employeeAuthCheck } = require('../middleware/employeeAuthCheck');

// Employee Login
router.post('/login', loginEmployee);

// Get logged-in employee profile
router.get('/profile', employeeAuthCheck, getEmployeeProfile);

module.exports = router;

