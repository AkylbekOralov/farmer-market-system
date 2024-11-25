// controllers/farmer/farmerController.js
const { FarmersProfile, User, Product, Category } = require("../../models");
const path = require("path");
const fs = require("fs");

// Fetch Crop Types (Categories)
exports.getCropTypes = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching crop types:", error.message);
    res.status(500).json({ message: "Failed to fetch crop types" });
  }
};

// Get Farmer Profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await FarmersProfile.findOne({
      where: { user_id: req.user.id },
      attributes: ["farm_address", "farm_size", "types_of_crops"],
    });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer profile not found" });
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["username", "email", "profile_picture", "phone"],
    });

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePicture: user.profile_picture,
      phone: user.phone,
      farmAddress: farmer.farm_address,
      farmSize: farmer.farm_size,
      crops: farmer.types_of_crops || [],
    });
  } catch (error) {
    console.error("Error fetching farmer profile:", error.message);
    res.status(500).json({ message: "Failed to fetch farmer profile" });
  }
};

// Update Farmer Profile
exports.updateFarmerProfile = async (req, res) => {
  const { username, phone, farmAddress, farmSize, crops } = req.body;

  try {
    const farmer = await FarmersProfile.findOne({
      where: { user_id: req.user.id },
    });
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!farmer || !user) {
      return res.status(404).json({ message: "Farmer profile not found" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    farmer.farm_address = farmAddress || farmer.farm_address;
    farmer.farm_size = farmSize || farmer.farm_size;
    farmer.types_of_crops = crops || farmer.types_of_crops;

    await user.save();
    await farmer.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating farmer profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Update Profile Picture Function
exports.updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove old profile picture from the server
    if (user.profile_picture) {
      const oldPath = path.resolve(__dirname, "../", user.profile_picture);
      fs.unlink(oldPath, (err) => {
        if (err)
          console.error("Error deleting old profile picture:", err.message);
      });
    }

    // Save the new profile picture
    const profilePicturePath = `uploads/profile_pictures/${req.file.filename}`;
    user.profile_picture = profilePicturePath;

    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: profilePicturePath, // Send relative path only
    });
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};

// Delete Profile Picture
exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove profile picture from the server
    if (user.profile_picture) {
      const oldPath = path.resolve(__dirname, "../", user.profile_picture);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Error deleting profile picture:", err.message);
      });

      user.profile_picture = null;
      await user.save();
    }

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error.message);
    res.status(500).json({ message: "Failed to delete profile picture" });
  }
};

// Controller function to add a new product
exports.addProduct = async (req, res) => {
  const { name, description, category, price, quantity, unit_of_measure } =
    req.body;

  try {
    // Validate category
    const categoryData = await Category.findOne({ where: { name: category } });
    if (!categoryData) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Process uploaded images
    const imagePaths = req.files.map((file) =>
      path.join("uploads/product_images", file.filename).replace(/\\/g, "/")
    );

    // Create the product
    const product = await Product.create({
      farmer_id: req.user.id,
      name,
      description,
      category_id: categoryData.id,
      price,
      quantity,
      unit_of_measure: unit_of_measure || "kg", // Default to 'kg'
      inventory_status:
        quantity > 0
          ? quantity < 5
            ? "Low Stock"
            : "In Stock"
          : "Out of Stock",
      images: imagePaths,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Get products that a farmer sells
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { farmer_id: req.user.id },
      attributes: [
        "id",
        "name",
        "description",
        "price",
        "quantity",
        "unit_of_measure",
        "images",
        "inventory_status",
      ],
      include: [
        {
          model: Category, // Join with Category model
          attributes: ["name"], // Select only the `name` field
        },
      ],
    });

    // Format products to include `category_name`
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      unit_of_measure: product.unit_of_measure,
      images: product.images,
      category_name: product.Category ? product.Category.name : null,
      inventory_status: product.inventory_status,
    }));

    res.status(200).json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching farmer products:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, category, price, quantity, unit_of_measure } =
    req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.unit_of_measure = unit_of_measure || product.unit_of_measure;

    // Handle new images
    if (req.files) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// Fetch a single product by ID
exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id, farmer_id: req.user.id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

exports.deleteProductImage = async (req, res) => {
  const { productId } = req.params;
  const { imagePath } = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the image from the product
    product.images = product.images.filter((image) => image !== imagePath);

    await product.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

exports.updateProductQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    if (quantity === undefined || isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid quantity value" });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity = parseInt(quantity); // Ensure it's an integer
    product.inventory_status =
      product.quantity > 0
        ? product.quantity < 5
          ? "Low Stock"
          : "In Stock"
        : "Out of Stock";

    await product.save();

    res.status(200).json({
      message: "Quantity updated successfully",
      product: { id: product.id, quantity: product.quantity },
    });
  } catch (error) {
    console.error("Error updating quantity:", error.message);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};
