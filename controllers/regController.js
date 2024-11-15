// controllers/regController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const { User, FarmersProfile, BuyersProfile, Payment } = require("../models");
const { generateToken } = require("../utils/tokenHandler");

exports.registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    role,
    delivery_address,
    farm_address,
    farm_size,
    types_of_crops,
    iin,
    card_type,
    card_number,
    expire_date,
    owner_name,
    cvc,
  } = req.body;

  try {
    // Check if email or username already exists
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: "Username already taken" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique token for the user
    const token = generateToken({ id: email });

    // Set admin_verified based on the role
    const isAdminVerified = role === "buyer";

    // Parse `types_of_crops` if it's a string
    let cropsArray = [];
    if (typeof types_of_crops === "string") {
      try {
        cropsArray = JSON.parse(types_of_crops);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid format for types_of_crops" });
      }
    } else if (Array.isArray(types_of_crops)) {
      cropsArray = types_of_crops;
    }

    // Get the file path of the uploaded image
    const profile_picture = req.file
      ? `/uploads/profile_pictures/${req.file.filename}`
      : null;

    // Create user record
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
      profile_picture,
      email_verified: false,
      admin_verified: isAdminVerified, // Set true for buyers, false for others
      token,
    });

    // Create specific profile based on role
    if (role === "farmer") {
      await FarmersProfile.create({
        user_id: newUser.id,
        farm_address,
        farm_size,
        types_of_crops: cropsArray,
        iin,
      });
    } else if (role === "buyer") {
      await BuyersProfile.create({
        user_id: newUser.id,
        delivery_address,
      });

      await Payment.create({
        user_id: newUser.id,
        card_type,
        card_number,
        expire_date,
        owner_name,
        cvc,
      });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    if (role === "farmer" || role === "buyer") {
      // Generate email verification link
      const verificationUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

      // Send verification email
      await sendEmail({
        to: email,
        subject: "Verify your email",
        text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      });
    }

    res
      .status(201)
      .json({ message: "Registration successful, please verify your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.registerAdmin = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if email or username already exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Invalid email" });

    if (username !== user.username)
      return res.status(404).json({ message: "Invalid username" });

    if (phone !== user.phone)
      return res.status(404).json({ message: "Invalid phone" });

    // Hash the password
    if (password !== user.password)
      return res.status(404).json({ message: "Invalid password" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Change user record
    user.email_verified = true;
    user.admin_verified = true;
    user.password = hashedPassword;
    await user.save();

    res.status(201).json({
      message: "Registration successful, your admin account is activated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
