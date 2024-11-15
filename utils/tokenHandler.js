// utils/tokenHandler
const jwt = require("jsonwebtoken");

// Generate a token with the email directly as the payload
exports.generateToken = (email) => {
  return jwt.sign(email, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Verify token and return the decoded email directly
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
