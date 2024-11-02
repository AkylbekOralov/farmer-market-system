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

// Get a list of farmers who needs validation
// Returns a list of id, name, email
router.get("/regFarmers", async (req, res) => {
  try {
    const sql =
      "SELECT id, username, email FROM farmers WHERE isVerified = true AND isValidated = false;";
    const result = await pool.query(sql);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching unvalidated farmers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get info about a farmer
// Returns a farmer info
router.get("/farmer", async (req, res) => {
  try {
    const { id } = req.body;
    const sql = `
            SELECT id, username, email, role, phone, isVerified, isValidated, farmAddress, farmSize, typesOfCrops, iin, createdAt
            FROM farmers
            WHERE id = $1;
        `;
    const result = await pool.query(sql, [id]);

    // If no farmer is found with the given ID, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching farmer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to validate a farmer by ID
router.post("/validateFarmer", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Farmer ID is required" });
    }

    const sql = `
            UPDATE farmers
            SET isValidated = true
            WHERE id = $1
            RETURNING id, username, email, role, phone, isVerified, isValidated, farmAddress, farmSize, typesOfCrops, iin, createdAt;
        `;

    const result = await pool.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json({
      message: "Farmer validated successfully",
      farmer: result.rows[0],
    });
  } catch (error) {
    console.error("Error validating farmer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add a new category
router.post("/addCat", async (req, res) => {
  const { name } = req.body; // Extract category name from request body

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]); // Respond with the newly added category
  } catch (err) {
    console.error("Error adding category:", err);
    if (err.code === "23505") {
      // Duplicate category name error
      res.status(409).json({ error: "Category name already exists" });
    } else {
      res.status(500).json({ error: "Failed to add category" });
    }
  }
});

// Route to delete a category by ID
router.delete("/delCat", async (req, res) => {
  const { id } = req.body; // Extract category ID from request parameters

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({
      message: "Category deleted successfully",
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
