
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


exports.employeeAuthCheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token user." });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("AuthCheck error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
