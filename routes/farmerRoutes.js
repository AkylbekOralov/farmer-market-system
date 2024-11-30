// routes/farmerRoutes
const express = require("express");
const router = express.Router();

const upload = require("../utils/upload"); // Use the exported multer instance
const uploadProductImages = require("../utils/uploadProductImages");
const {
  getFarmerProfile,
  updateFarmerProfile,
  updateProfilePicture,
  deleteProfilePicture,
  getCropTypes,
  addProduct,
  getFarmerProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  updateProductQuantity,
} = require("../controllers/farmer/farmerController");
const isFarmer = require("../middlewares/isFarmer");

// orderController
const {
  getFarmerOrders,
  updateOrderItemStatus,
} = require("../controllers/farmer/orderController");

// inventoryController
const {
  getInventory,
  updateProdQuantity,
} = require("../controllers/farmer/inventoryController");

// Reports
const { getReports } = require("../controllers/farmer/reportsController");

// Farmer Profile Routes
router.get("/profile", isFarmer, getFarmerProfile);
router.put("/profile", isFarmer, updateFarmerProfile);
router.post(
  "/profile-picture",
  isFarmer,
  upload.single("profilePicture"), // Correctly use the configured multer instance
  updateProfilePicture
);
router.delete("/profile-picture", isFarmer, deleteProfilePicture);

// Crop Types
router.get("/crop-types", isFarmer, getCropTypes);

// Product Routes
router.post(
  "/product",
  isFarmer,
  uploadProductImages.array("productImages", 5), // Allow up to 5 images
  addProduct
);
router.get("/products", isFarmer, getFarmerProducts);
router.get("/product/:id", isFarmer, getProductDetails);
router.put(
  "/product/:productId",
  isFarmer,
  upload.array("newImages", 5),
  updateProduct
);
router.delete("/product/:productId/image", isFarmer, deleteProductImage);
router.delete("/product/:id", isFarmer, deleteProduct);
router.put(
  "/product/:productId/quantity",
  isFarmer, // Replaced `authenticateUser` with `isFarmer` for consistency
  updateProductQuantity
);

// Order related
router.get("/orders", isFarmer, getFarmerOrders);
router.put("/order-item/:orderItemId/status", isFarmer, updateOrderItemStatus);

// Inventory Routes
router.get("/inventory", isFarmer, getInventory);
router.put("/inventory/:productId/quantity", isFarmer, updateProdQuantity);

// Reports Route
router.get("/reports", isFarmer, getReports);

module.exports = router;
