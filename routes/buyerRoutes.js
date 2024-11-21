const express = require("express");

// Import the common methods
const { viewCategories } = require("../controllers/buyer/buyerController");

// Import product search related methods
const { viewProducts } = require("../controllers/buyer/searchController");

const isBuyer = require("../middlewares/isBuyer");

const router = express.Router();

// View all products
router.get("/products", isBuyer, viewProducts);

// View all categories
router.get("/categories", isBuyer, viewCategories); // New route for categories

module.exports = router;
