// routes/farmerRoutes.js
const express = require("express");
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
} = require("../controllers/farmerController");
const isFarmer = require("../middlewares/isFarmer");

const router = express.Router();

router.get("/profile", isFarmer, getFarmerProfile);
router.put("/profile", isFarmer, updateFarmerProfile);
router.post(
  "/profile-picture",
  isFarmer,
  upload.single("profilePicture"), // Correctly use the configured multer instance
  updateProfilePicture
);
router.delete("/profile-picture", isFarmer, deleteProfilePicture);
router.get("/crop-types", isFarmer, getCropTypes); // Protect the route with `isFarmer` middleware
router.post(
  "/product",
  isFarmer,
  uploadProductImages.array("productImages", 5), // Allow up to 5 images
  addProduct
);
router.get("/products", isFarmer, getFarmerProducts);

router.get("/product/:id", isFarmer, getProductDetails); // Fetch a single product by ID
router.put(
  "/product/:productId",
  isFarmer,
  upload.array("newImages", 5),
  updateProduct
);
router.delete("/product/:productId/image", isFarmer, deleteProductImage);

router.delete("/product/:id", isFarmer, deleteProduct); // Delete a product

module.exports = router;
