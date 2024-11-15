// routes/adminRoutes
const express = require("express");
const {
  verifyUser,
  getUnverifiedFarmers,
  deactivateuser,
  addCategory,
  updateCategory,
  deleteCategory,
  listCategories,
} = require("../controllers/adminController");
const isAdmin = require("../middlewares/isAdmin"); // Import the middleware

const router = express.Router();

// Apply the isAdmin middleware to the routes that require admin access

// Admin verifies a farmer (using the farmer's user ID)
router.put("/verify-user/:userId", isAdmin, verifyUser);

// Route to get unverified farmers
router.get("/unverified-farmers", isAdmin, getUnverifiedFarmers);

// Admin diactivates a farmer (using the user's user ID)
router.put("/unverify-user/:userId", isAdmin, deactivateuser);

// Route for adding a new category
router.post("/category", isAdmin, addCategory);

// Route for updating an existing category
router.put("/category/:id", isAdmin, updateCategory);

// Route for deleting a category
router.delete("/category/:id", isAdmin, deleteCategory);

// Route for listing all categories
router.get("/categories", isAdmin, listCategories);

module.exports = router;
