const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  try {
    return jwt.sign(
      { id },                  // Payload
      process.env.JWT_SECRET,  // Secret key
      { expiresIn: "7d" }      // Token expiry
    );
  } catch (error) {
    console.error("JWT Token Generation Error:", error.message);
    return null;
  }
};

module.exports = generateToken;
