const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const authRoutes = require("./auth");

const app = express();
const port = 8383;

// Connecting to PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2026",
  database: "farmer_market_db",
  port: 5432,
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to PostgreSQL database!");
});

app.use(cors());
app.use(express.json());
app.use(authRoutes);

// Nodemailer setup for sending email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oralovv26@gmail.com",
    pass: "puhj lkym tpdh wxrj",
  },
});

// Helper function to send verification email
const sendVerificationEmail = (email, verificationToken) => {
  const verificationLink = `http://localhost:8383/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: "oralovv26@gmail.com",
    to: email,
    subject: "Verify Your Email",
    text: `Please click the link to verify your email: ${verificationLink}`,
  };

  return transporter.sendMail(mailOptions);
};

// Helper function to check email and username uniqueness
const isEmailOrUsernameTaken = async (email, username) => {
  const sql = "SELECT * FROM users WHERE email = $1 OR username = $2";
  const values = [email, username];
  const result = await pool.query(sql, values);
  return result.rowCount > 0; // Returns true if a match is found
};

// Farmer Registration Endpoint
app.post("/farmer-register", async (req, res) => {
  const {
    name,
    email,
    phone,
    farmAddress,
    farmSize,
    cropTypes,
    iin,
    password,
  } = req.body;

  try {
    // Check for email and username uniqueness
    if (await isEmailOrUsernameTaken(email, name)) {
      return res
        .status(400)
        .json({ message: "Email or username already taken!" });
    }

    // Validate email
    const validationResult = await validate(email);
    if (!validationResult.valid) {
      return res.status(400).json({ message: "Invalid email address!" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Insert farmer into PostgreSQL
    const sql = `
        INSERT INTO farmers (username, email, password, role, phone, farmAddress, farmSize, typesOfCrops, iin, isVerified, verificationToken)
        VALUES ($1, $2, $3, 'farmer', $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`;
    const values = [
      name,
      email,
      password,
      phone,
      farmAddress,
      farmSize,
      cropTypes,
      iin,
      false,
      verificationToken,
    ];

    await pool.query(sql, values);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res
      .status(201)
      .json({ message: "Farmer registered. Verification email sent." });
    console.log(`Added new farmer: ${email}`);
  } catch (error) {
    console.error("Error during farmer registration:", error);
    res.status(500).send("Farmer registration failed");
  }
});

// Buyer Registration Endpoint
app.post("/buyer-register", async (req, res) => {
  const { name, email, phone, deliveryAddress, paymentMethod, password } =
    req.body;

  try {
    // Check for email and username uniqueness
    if (await isEmailOrUsernameTaken(email, name)) {
      return res
        .status(400)
        .json({ message: "Email or username already taken!" });
    }

    // Validate email
    const validationResult = await validate(email);
    if (!validationResult.valid) {
      return res.status(400).json({ message: "Invalid email address!" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Insert buyer into PostgreSQL
    const sql = ` 
        INSERT INTO buyers (username, email, password, role, phone, deliveryAddress, payment, isVerified, verificationToken)
        VALUES ($1, $2, $3, 'buyer', $4, $5, $6, $7, $8)
        RETURNING *`;
    const values = [
      name,
      email,
      password,
      phone,
      deliveryAddress,
      paymentMethod,
      false,
      verificationToken,
    ];

    await pool.query(sql, values);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res
      .status(201)
      .json({ message: "Buyer registered. Verification email sent." });
    console.log(`Added new buyer: ${email}`);
  } catch (error) {
    console.error("Error during buyer registration:", error);
    res.status(500).send("Buyer registration failed");
  }
});

// Email verification endpoint
app.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  const sql =
    "UPDATE users SET isVerified = true WHERE verificationToken = $1 RETURNING *";
  const values = [token];

  try {
    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      return res.status(400).send("Invalid or expired token");
    }
    res.send("Email verified successfully!");
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send("Failed to verify email");
  }
});

// Hosting
app.listen(port, () => console.log(`Server has started on port: ${port}`));
