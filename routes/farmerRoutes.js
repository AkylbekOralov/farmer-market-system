// routes/farmerRoutes.js
const express = require("express");
const { addProduct, viewOrders } = require("../controllers/farmerController");
const isFarmer = require("../middlewares/isFarmer");

const router = express.Router();

// Route for adding a product
router.post("/product", isFarmer, addProduct);

// Route for viewing all orders for the farmer
router.get("/orders", isFarmer, viewOrders);

module.exports = router;
