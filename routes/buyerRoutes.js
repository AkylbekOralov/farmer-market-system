// routes/buyerRoutes.js
const express = require("express");
const { viewProducts, placeOrder } = require("../controllers/buyerController");
const isBuyer = require("../middlewares/isBuyer");

const router = express.Router();

// Route for viewing all products
router.get("/products", isBuyer, viewProducts);

// Route for placing an order
router.post("/order", isBuyer, placeOrder);

module.exports = router;
