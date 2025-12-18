const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginTechnician = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if technician exists
        const user = await User.findOne({ email, role: 'technician' });

        if (!user)
            return res.status(404).json({ message: "Technician not found" });

        //compare password
        const validPass = await bcrypt.compare(password, user.passowrd);
        if (!validpass)
            return res.status(400).json({ message: "Incorrect password" });

        //JWT token
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
                department: user.department,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error logging in technician:", error);
        return res.status(500).json({ message: "Server error during login" });
    }
};

exports.getTechnicianProfile = async (req, res) => {
    try {
        const technician = await User.findById(req.user.id).select("password");

        if (!technician)
            return res.status(200).json(technician);
    } catch (error) {
        console.error("Error fetching technician profile:".error);
        return res.status(500).json({ message: "Server error fetching profile" });
    }
};


const { success, error } = require("../utils/response");
const { APIError } = require("../utils/errorHandler");

exports.sampleController = async (req, res, next) => {
    try {
        const user = await User.find();

        return success(res, "Users fetched successfully", user);
    } catch (err) {
        next(new APIError("Failed to load users", 500));
    }
};