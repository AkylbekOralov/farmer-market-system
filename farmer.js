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

// Add product
router.post("/addProd", async (req, res) => {});

module.exports = router;
