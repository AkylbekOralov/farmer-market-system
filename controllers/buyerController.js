const { Product, Category } = require("../models");

// Fetch all products with category details
exports.viewProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ["name"], // Include category name
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

// Place an order (stubbed for now)
exports.placeOrder = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ["name"], // Include category name
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
