// utils/loginTokenHandler.js
const jwt = require("jsonwebtoken");

// Generate a login token with user details
exports.generateLoginToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email }, // Include necessary fields
    process.env.JWT_SECRET,
    { expiresIn: "3h" } // Set expiration as needed
  );
};

// Verify the login token
exports.verifyLoginToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Login token verification error:", error);
    return null; // or throw an error to handle in controllers
  }
};
