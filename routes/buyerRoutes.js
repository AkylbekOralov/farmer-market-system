// routes/buyerRoutes
const express = require("express");
const upload = require("../utils/upload"); // Utility for handling file uploads

// Import the common methods
const { viewCategories } = require("../controllers/buyer/buyerController");

// Import product search related methods
const {
  getProducts,
  getProductsByCategory,
} = require("../controllers/buyer/searchController");

// Import account related methods
const {
  getBuyerProfile,
  updateBuyerProfile,
  updateProfilePicture,
} = require("../controllers/buyer/accountController");

// Import cart related methods
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} = require("../controllers/buyer/cartController");

// Import order related methods
const {
  placeOrder,
  getOrders,
  getOrderDetails,
} = require("../controllers/buyer/orderController");

const isBuyer = require("../middlewares/isBuyer");

const router = express.Router();

// Common methods
router.get("/categories", isBuyer, viewCategories); // New route for categorie

// Product search related methods
router.get("/products", isBuyer, getProducts);
router.get("/categories/:categoryId/products", isBuyer, getProductsByCategory);

// Account related methods
router.get("/profile", isBuyer, getBuyerProfile); // Get buyer profile
router.put("/profile", isBuyer, updateBuyerProfile); // Update buyer profile
router.post(
  "/profile-picture",
  isBuyer,
  upload.single("profilePicture"),
  updateProfilePicture
); // Update profile picture

// Cart related methods
router.post("/cart", isBuyer, addToCart);
router.get("/cart", isBuyer, getCart);
router.delete("/cart/:cart_id", isBuyer, removeFromCart);
router.put("/cart/:cart_id", isBuyer, updateCartQuantity);

// Order related methods
router.post("/place-order", isBuyer, placeOrder);
router.get("/orders", isBuyer, getOrders);
router.get("/order/:orderId", isBuyer, getOrderDetails);

module.exports = router;
