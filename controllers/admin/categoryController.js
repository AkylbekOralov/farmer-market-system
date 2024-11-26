// controllers/admin/categoryController
const { Category } = require("../../models");

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Check if the category name already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create the new category
    const newCategory = await Category.create({ name });
    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Find the category by ID
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category name
    category.name = name;
    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the category by ID
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.listCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.status(200).json({ message: "List of categories", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};
