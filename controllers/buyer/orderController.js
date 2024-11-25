// controllers/buyer/orderController.js
const {
  Cart,
  Order,
  OrderItem,
  Product,
  BuyersProfile,
} = require("../../models");

exports.placeOrder = async (req, res) => {
  const buyerId = req.user.id; // Assuming `req.user` contains the authenticated user's data

  try {
    // Fetch all cart items for the buyer
    const cartItems = await Cart.findAll({
      where: { buyer_id: buyerId },
      include: [
        {
          model: Product,
          as: "cart_product", // Use the alias defined in the Cart model
          attributes: ["id", "name", "price", "quantity"],
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    // Fetch buyer's delivery address
    const buyerProfile = await BuyersProfile.findOne({
      where: { user_id: buyerId },
      attributes: ["delivery_address"],
    });

    if (!buyerProfile) {
      return res.status(404).json({ message: "Delivery address not found." });
    }

    const deliveryAddress = buyerProfile.delivery_address;

    // Calculate the total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.cart_product.price,
      0
    );

    // Create a new order
    const newOrder = await Order.create({
      buyer_id: buyerId,
      status: "Pending",
      total_amount: totalAmount,
      tax_amount: 0.0, // Adjust as needed
      discount: 0.0, // Adjust as needed
      delivery_date: null, // Can be set later
      tracking_id: null, // Can be set later
    });

    // Add items to the order_items table
    for (const cartItem of cartItems) {
      // Check stock availability
      if (cartItem.quantity > cartItem.cart_product.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${cartItem.cart_product.name}`,
        });
      }

      // Add order item
      await OrderItem.create({
        order_id: newOrder.id,
        product_id: cartItem.cart_product.id,
        quantity: cartItem.quantity,
        price: cartItem.cart_product.price,
      });

      // Update product stock
      cartItem.cart_product.quantity -= cartItem.quantity;
      await cartItem.cart_product.save();
    }

    // Clear the cart
    await Cart.destroy({ where: { buyer_id: buyerId } });

    res.status(201).json({
      message: "Order placed successfully.",
      order: newOrder,
      deliveryAddress,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order." });
  }
};

exports.getOrders = async (req, res) => {
  const buyerId = req.user.id;

  try {
    const orders = await Order.findAll({
      where: { buyer_id: buyerId },
      attributes: ["id", "total_amount", "status", "created_at"],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          include: {
            model: Product,
            attributes: ["name", "price", "images"],
          },
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
};
