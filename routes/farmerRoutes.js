// routes/farmerRoutes.js
const express = require("express");
const upload = require("../utils/upload"); // Use the exported multer instance
const {
  getFarmerProfile,
  updateFarmerProfile,
  updateProfilePicture,
  deleteProfilePicture,
  getCropTypes,
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

module.exports = router;
