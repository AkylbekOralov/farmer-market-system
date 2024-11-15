// controllers/adminController
const { User } = require("../models");
const { Category } = require("../models");

exports.verifyUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(404).json({ message: "Admins cannot be verified" });
    }

    // If the user is already verified, send a response
    if (user.admin_verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Update the user's `admin_verified` field to true
    user.admin_verified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUnverifiedFarmers = async (req, res) => {
  try {
    // Find all farmers with admin_verified set to false
    const unverifiedFarmers = await User.findAll({
      where: {
        role: "farmer",
        admin_verified: false,
      },
      attributes: ["id", "username", "email", "phone", "profile_picture"], // Specify fields to return
    });

    // Return the list of unverified farmers
    res.status(200).json({
      message: "List of unverified farmers",
      data: unverifiedFarmers,
    });
  } catch (error) {
    console.error("Error fetching unverified farmers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deactivateuser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(404).json({ message: "Admins cannot be diactivated" });
    }

    // If the user is already diactivated, send a response
    if (!user.admin_verified) {
      return res.status(400).json({ message: "User is already diactivated" });
    }

    // Update the farmer's `admin_verified` field to true
    user.admin_verified = false;
    await user.save();

    res.status(200).json({ message: "User diactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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
