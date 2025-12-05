const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_prod';

async function authenticateEmployee(email, password) {
  const user = await User.findOne({email, role: 'employee'});
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if(!match) return null;

  const token = jwt.sign({id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES
  });

  return { user, token};
}

async function getEmployeeById(id) {
  return User.findById(id).select('-password');
}

async function createEmployee(payload) {
  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, password: hashed, role: 'employee' });
  return user;
}

module.exports = {
  authenticateEmployee,
  getEmployeeById,
  createEmployee
};