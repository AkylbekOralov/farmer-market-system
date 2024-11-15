// controllers/farmerController.js
const { Product } = require("../models");

exports.addProduct = async (req, res) => {
  const { name, price, quantity, description } = req.body;

  try {
    const product = await Product.create({
      farmer_id: req.user.id,
      name,
      price,
      quantity,
      description,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.viewOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { farmer_id: req.user.id } });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
