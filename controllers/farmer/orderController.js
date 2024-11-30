// controllers/farmer/orderController.js
const { Order, OrderItem, Product, User } = require("../../models");

exports.getFarmerOrders = async (req, res) => {
  const farmerId = req.user.id; // Authenticated farmer's ID

  try {
    // Fetch orders where the farmer owns products in the order
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              where: { farmer_id: farmerId }, // Filter by farmer's products
              attributes: ["id", "name", "unit_of_measure", "farmer_id"], // Include farmer_id
            },
          ],
          attributes: ["id", "quantity", "price", "status"], // Include id, quantity, price, and status
        },
        {
          model: User,
          as: "Buyer", // Use the alias for the buyer (User model)
          attributes: ["username"], // Include buyer's username
        },
      ],
      attributes: ["id", "status", "created_at"], // Include order-level attributes
      order: [["created_at", "DESC"]],
    });

    // Filter orders to include only those with the farmer's products
    const filteredOrders = orders
      .map((order) => {
        const farmerItems = order.OrderItems.filter(
          (item) => item.Product && item.Product.farmer_id === farmerId // Ensure farmer_id matches
        );

        if (farmerItems.length > 0) {
          return {
            orderId: order.id,
            buyerName: order.Buyer.username,
            status: order.status,
            createdAt: order.created_at,
            totalOrderAmount: farmerItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            ),
            items: farmerItems.map((item) => ({
              orderItemId: item.id,
              productName: item.Product.name,
              quantity: item.quantity,
              unitOfMeasure: item.Product.unit_of_measure,
              totalPrice: item.price * item.quantity,
              status: item.status, // Include status
            })),
          };
        }
        return null;
      })
      .filter((order) => order !== null);

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error("Error fetching farmer's orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.updateOrderItemStatus = async (req, res) => {
  const farmerId = req.user.id;
  const { orderItemId } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Find the order item and ensure it belongs to the farmer
    const orderItem = await OrderItem.findOne({
      where: { id: orderItemId },
      include: [
        {
          model: Product,
          where: { farmer_id: farmerId },
          attributes: [], // We don't need any attributes from Product
        },
      ],
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Update the status
    orderItem.status = status;
    await orderItem.save();

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating order item status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
