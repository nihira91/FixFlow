const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginEmployee = async (req, res) => {
  try {
    const {email, password } = req.body;
    if(!email || !password) return res.status(400).json({message: "Email and password required" });

    const user = await User.findOne({ email, role: 'employee'});
    if(!user) return res.status(404).json({message: "Employee not found"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({message: "Invalid credentials"});

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id, name: user.name, email: user.email, department: user.department, floor: user.floor, deskId: user.deskId
      }
    });
  } catch (err) {
    console.error('loginEmployee error:', err);
    res.status(500).json({message: 'Server error'});
  }
};

exports.getEmployeeProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(400).json({message: 'Employee not found'});
    res.status(200).json(user);
  } catch (err) {
    console.error('getEmployeeProfile error:', err);
    res.status(500).json({ message: 'server error'});
  }
};