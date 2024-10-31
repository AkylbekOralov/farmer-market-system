// auth.js
const express = require("express");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const router = express.Router();
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2026",
  database: "farmer_market_db",
  port: 5432,
});

const JWT_SECRET = "your_jwt_secret_key";

// Enhanced Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(`Trying login: ${email} ${password}`);

  try {
    // Find user by email
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(sql, [email]);
    const user = result.rows[0];

    if (!user) {
      console.log(`User not found`);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log(`User found: ${user.role} and ${user.id}`);

    // Verify password
    if (password !== user.password) {
      console.log(`Invalid password`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Role-based verification checks
    if (user.role === "buyer" && !user.isverified) {
      console.log(`Buyer email is not verified.`);
      return res.status(400).json({ message: "Email is not verified." });
    }

    if (user.role === "farmer" && (!user.isverified || !user.isvalidated)) {
      console.log(`Farmer is either not verified or not validated.`);
      return res
        .status(400)
        .json({ message: "Account is either not verified or not validated." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send back token and role info for front-end redirection
    console.log("Login successful");
    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
