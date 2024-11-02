const express = require("express");
const { Pool } = require("pg");
const router = express.Router();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2026",
  database: "farmer_market_db",
  port: 5432,
});

// Route to get list of category names
router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT name FROM categories"); // Query to get only names
    const categoryNames = result.rows.map((row) => row.name); // Extract names from rows
    res.json(categoryNames); // Send names as JSON
  } catch (err) {
    console.error("Error fetching category names:", err);
    res.status(500).json({ error: "Failed to fetch category names" });
  }
});

module.exports = router;
