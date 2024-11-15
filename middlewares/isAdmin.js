// middlewares/isAdmin.js
const { verifyLoginToken } = require("../utils/loginTokenHandler");
const { User } = require("../models");

const isAdmin = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Remove "Bearer " prefix to get the token itself
    const token = authHeader.replace("Bearer ", "").trim();

    // Verify the login token using verifyLoginToken
    const decoded = verifyLoginToken(token);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find the user based on the decoded token
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: "User not found." });

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Add the user info to the request object for further use
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAdmin;
