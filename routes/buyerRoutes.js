const express = require("express");
const { viewProducts, placeOrder, viewCategories } = require("../controllers/buyerController"); // Import the viewCategories method
const isBuyer = require("../middlewares/isBuyer");

const router = express.Router();

// View all products
router.get("/products", isBuyer, viewProducts);

// Place an order
router.post("/order", isBuyer, placeOrder);

// View all categories
router.get("/categories", isBuyer, viewCategories); // New route for categories

module.exports = router;
