const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const authMiddleware = async (req, res, next) => {
  try {
    
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Attach user to request
    next();

  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
