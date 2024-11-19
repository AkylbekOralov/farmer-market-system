// controllers/farmerController.js
const { Product } = require("../models");
const path = require("path");
const fs = require("fs");
const { FarmersProfile, User } = require("../models");

exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await FarmersProfile.findOne({
      where: { user_id: req.user.id }, // Ensure `req.user.id` is set by middleware
      attributes: ["farm_address", "farm_size", "types_of_crops"], // Select only necessary fields
    });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer profile not found" });
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["username", "email", "profile_picture"],
    });

    res.status(200).json({
      name: user.username,
      email: user.email,
      farmAddress: farmer.farm_address,
      farmSize: farmer.farm_size,
      crops: farmer.types_of_crops,
    });
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, quantity, description, category_id, unit_of_measure } =
    req.body;

  try {
    // Process image URLs
    const imagePaths = req.files.map((file) =>
      path.join("uploads/product_images", file.filename)
    );

    const product = await Product.create({
      farmer_id: req.user.id,
      name,
      price,
      quantity,
      description,
      category_id,
      unit_of_measure,
      images: imagePaths, // Save image paths as an array
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editProduct = async (req, res) => {
  const { id } = req.params; // product ID
  const {
    name,
    price,
    quantity,
    description,
    category_id,
    unit_of_measure,
    removeImages,
  } = req.body;

  try {
    // Find the product
    const product = await Product.findOne({
      where: { id, farmer_id: req.user.id },
    });

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or you don't have permission to edit this product.",
      });
    }

    // Update fields if provided in the request body
    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.description = description || product.description;
    product.category_id = category_id || product.category_id;
    product.unit_of_measure = unit_of_measure || product.unit_of_measure;

    // Handle removing images from the server and database
    if (removeImages && Array.isArray(removeImages)) {
      const updatedImages = product.images.filter(
        (img) => !removeImages.includes(img)
      );

      // Delete the removed images from the server
      for (const imagePath of removeImages) {
        const fullPath = path.join(__dirname, "../", imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error(`Error deleting image ${fullPath}:`, err);
        });
      }

      // Update product images
      product.images = updatedImages;
    }

    // Handle new image uploads if they exist
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) =>
        path.join("uploads/product_images", file.filename)
      );
      product.images = [...product.images, ...newImagePaths]; // Combine existing and new images
    }

    // Save updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
