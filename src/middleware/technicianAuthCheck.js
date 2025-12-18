const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//verify technician token only
module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];

        if (!token)
            return res.status(401).json({ message: "Invalid token format" });

        //verify jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRT);

        //match users
        const user = await User.findById(decoded.id).select("password role");

        if (!user)
            return res.status(401).json({ message: "user not found" });

        if (user.role != "technician")
            return res.status(403).json({ message: "Technician access required" });

        //attach technician data to request

        req.user = user;
        next();


    } catch (error) {
        console.error("Technician auth error:", error);
        return res.status(401).json({ message: "Unauthorized or expired token" });
    }
};