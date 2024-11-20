const express = require("express");
const multer = require("../utils/upload");
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
  multer.single("profilePicture"),
  updateProfilePicture
);
router.delete("/profile-picture", isFarmer, deleteProfilePicture);
router.get("/crop-types", isFarmer, getCropTypes); // Protect the route with `isFarmer` middleware

module.exports = router;
