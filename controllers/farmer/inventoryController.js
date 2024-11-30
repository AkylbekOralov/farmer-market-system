// controllers/farmer/inventoryController.js
const { Product, Category } = require("../../models");

// Get the farmer's inventory
exports.getInventory = async (req, res) => {
  const farmerId = req.user.id; // Authenticated farmer's ID

  try {
    const products = await Product.findAll({
      where: { farmer_id: farmerId },
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
      ],
    });

    const inventory = products.map((product) => ({
      id: product.id,
      name: product.name,
      category_name: product.Category ? product.Category.name : null,
      quantity: product.quantity,
      unit_of_measure: product.unit_of_measure,
      inventory_status: product.inventory_status,
    }));

    res.status(200).json({ products: inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Failed to fetch inventory" });
  }
};

// Update product quantity
exports.updateProdQuantity = async (req, res) => {
  const farmerId = req.user.id;
  const { productId } = req.params;
  const { quantity } = req.body; // Amount to add or subtract

  try {
    // Find the product and ensure it belongs to the farmer
    const product = await Product.findOne({
      where: { id: productId, farmer_id: farmerId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentQuantity = parseFloat(product.quantity);
    const quantityToAdd = parseFloat(quantity);

    const newQuantity = currentQuantity + quantityToAdd;

    if (newQuantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    product.quantity = newQuantity;

    // Update inventory_status based on new quantity
    if (newQuantity === 0) {
      product.inventory_status = "Out of Stock";
    } else if (newQuantity < 10) {
      product.inventory_status = "Low Stock";
    } else {
      product.inventory_status = "In Stock";
    }

    await product.save();

    res.status(200).json({ message: "Quantity updated successfully", product });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};
