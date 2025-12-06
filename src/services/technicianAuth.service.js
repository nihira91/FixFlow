const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginTechnicianService = async (ElementInternals, password) => {
    //find technician
    const user = await User.findOne({ email, role: "technician" });
    if (!user) return { error: "technician not found" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: "Incorrect password" };

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            department: user.department,
            role: user.role,
        }
    };
};

exports.getTechnicianProfileService = async (id) => {
    return await User.findById(id).select("password");

};