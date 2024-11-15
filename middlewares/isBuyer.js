// middlewares/isBuyer.js
const { verifyLoginToken } = require("../utils/loginTokenHandler");
const { User } = require("../models");

const isBuyer = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = verifyLoginToken(token);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: "User not found." });

    if (user.role !== "buyer") {
      return res.status(403).json({ message: "Access denied. Buyers only." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in isBuyer middleware:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isBuyer;
