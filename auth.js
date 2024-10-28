// auth.js
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
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
  console.log(`Trying Login: ${email} ${password}`);

  try {
    // Find user by email
    const sql = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(sql, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Role-based verification checks
    if (user.role === "buyer" && !user.isverified) {
      return res.status(400).json({ message: "Email is not verified." });
    }

    if (user.role === "farmer" && (!user.isverified || !user.isvalidated)) {
      return res
        .status(400)
        .json({ message: "Account is either not verified or not validated." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send back token and role info for front-end redirection
    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Login failed");
  }
});

module.exports = router;
