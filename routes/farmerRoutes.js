// routes/farmerRoutes.js
const express = require("express");
const {
  addProduct,
  editProduct,
  getFarmerProfile,
} = require("../controllers/farmerController");
const isFarmer = require("../middlewares/isFarmer");
const upload = require("../utils/upload"); // Import the multer upload configuration

const router = express.Router();

router.get("/profile", isFarmer, getFarmerProfile);

// Route to add a product with up to 5 images
router.post("/add-product", isFarmer, upload.array("images", 5), addProduct);

// Route to edit a product with up to 5 new images
router.patch(
  "/edit-product/:id",
  isFarmer,
  upload.array("images", 5),
  editProduct
);

module.exports = router;
