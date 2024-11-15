// controllers/buyerController.js
const { Product, Order } = require("../models");

exports.viewProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.placeOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const order = await Order.create({
      buyer_id: req.user.id,
      product_id: productId,
      quantity,
      status: "Pending",
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
