// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateLoginToken } = require("../utils/loginTokenHandler");
const { Op } = require("sequelize");

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.id; // Get email from decoded token

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already verified
    if (user.email_verified)
      return res.status(400).json({ message: "Email already verified" });

    // Update user to mark as verified
    user.email_verified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username: email }],
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check if email is verified
    if (!user.email_verified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    // Check if admin is verified for farmer
    if (!user.admin_verified) {
      return res
        .status(400)
        .json({ message: "Please wait for admin validation" });
    }

    // Generate JWT token
    const token = generateLoginToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
