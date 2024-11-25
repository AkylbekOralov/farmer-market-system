// controllers/buyer/buyerController.js
const { Category } = require("../../models");

// Fetch all categories
exports.viewCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"], // Fetch only ID and name fields
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};
