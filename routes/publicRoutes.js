// routes/publicRoutes.js
const express = require("express");
const {
  viewProducts,
  getCategories,
} = require("../controllers/publicController");

const router = express.Router();

// Route to get all products
router.get("/products", viewProducts);

// Route to get all categories
router.get("/categories", getCategories);

module.exports = router;
