

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


function checkRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = {
  verifyToken,
  checkRole,
};
