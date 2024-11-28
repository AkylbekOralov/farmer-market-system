// controllers/farmer/orderController
const {
  Order,
  OrderItem,
  Product,
  BuyersProfile,
  User,
} = require("../../models");

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
          attributes: ["quantity", "price"], // Include quantity and price
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
              productName: item.Product.name,
              quantity: item.quantity,
              unitOfMeasure: item.Product.unit_of_measure,
              totalPrice: item.price * item.quantity,
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
