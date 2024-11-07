// controllers/regController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const { User, FarmersProfile, BuyersProfile } = require("../models"); // Assuming models are created
const { generateToken } = require("../utils/tokenHandler");

exports.registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    role,
    delivery_address,
    payment_method,
    farm_address,
    farm_size,
    types_of_crops,
    iin,
  } = req.body;

  try {
    // Check if email or username already exists
    var existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user record
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
      is_verified: false,
    });

    // Create specific profile based on role
    if (role === "farmer") {
      await FarmersProfile.create({
        user_id: newUser.id,
        farm_address,
        farm_size,
        types_of_crops,
        iin,
      });
    } else if (role === "buyer") {
      await BuyersProfile.create({
        user_id: newUser.id,
        delivery_address,
        payment_method,
      });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Generate email verification token
    const verificationToken = generateToken(newUser.id);
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await sendEmail({
      to: email,
      subject: "Verify your email",
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    });

    res
      .status(201)
      .json({ message: "Registration successful, please verify your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
