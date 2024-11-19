// routes/buyerRoutes.js
const express = require("express");
const { viewProducts, placeOrder } = require("../controllers/buyerController");
const isBuyer = require("../middlewares/isBuyer");

const router = express.Router();

// View all products
router.get("/products", isBuyer, viewProducts);

// Place an order
router.post("/order", isBuyer, placeOrder);

module.exports = router;
