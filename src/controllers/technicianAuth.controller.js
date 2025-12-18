const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* ============================
   TECHNICIAN SIGNUP
============================ */


exports.signupTechnician = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const technician = await User.create({
      name,
      email,
      password, // hashed by model
      role: "technician"
    });

    return res.status(201).json({
      message: "Technician registered successfully",
      user: {
        id: technician._id,
        name: technician.name,
        email: technician.email,
        role: technician.role
      }
    });

  } catch (error) {
    console.error("Technician signup error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

/* ============================
   TECHNICIAN LOGIN
============================ */
exports.loginTechnician = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "technician" });
    if (!user) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Technician login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error logging in technician:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

/* ============================
   TECHNICIAN PROFILE
============================ */
exports.getTechnicianProfile = async (req, res) => {
  try {
    const technician = await User.findById(req.user.id).select("-password");

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    return res.status(200).json(technician);

  } catch (error) {
    console.error("Error fetching technician profile:", error);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};
