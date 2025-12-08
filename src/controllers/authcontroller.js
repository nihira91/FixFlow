// const User = require("../models/usermodel");
// const bcrypt = require("bcryptjs");
// const generateToken = require("../utils/generateToken");

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existing = await User.findOne({ email, role });
//     if (existing) {
//       return res.status(400).json({ message: "User already exists with this email and role" });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       role,
//     });

//     return res.status(201).json({
//       message: "Signup successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         email: user.email,
//       },
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//       return res.status(400).json({ message: "Email, password & role are required" });
//     }

//     const user = await User.findOne({ email, role });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Incorrect password" });

//     return res.json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         email: user.email,
//       },
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔥 Convert role to lowercase so it matches schema
    const roleLower = role.toLowerCase();

    const existing = await User.findOne({ email, role: roleLower });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email and role" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: roleLower,   // 🔥 store lowercase role
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password & role are required" });
    }

    // 🔥 Same fix for login
    const roleLower = role.toLowerCase();

    const user = await User.findOne({ email, role: roleLower });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

