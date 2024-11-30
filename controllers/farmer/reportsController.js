// controllers/farmer/reportsController.js

const { Order, OrderItem, Product } = require("../../models");
const { Op, fn, col, literal } = require("sequelize");

exports.getReports = async (req, res) => {
  const farmerId = req.user.id;
  const { month, year } = req.query; // Retrieve month and year from query parameters

  try {
    // 1. Best-selling products (All Time)
    const bestSellingProducts = await OrderItem.findAll({
      include: [
        {
          model: Product,
          where: { farmer_id: farmerId },
          attributes: ["id", "name", "images"],
        },
      ],
      attributes: [
        "product_id",
        [fn("SUM", col("OrderItem.quantity")), "total_quantity"],
      ],
      group: ["OrderItem.product_id", "Product.id"],
      order: [[literal("total_quantity"), "DESC"]],
      limit: 5,
      raw: true, // Return plain objects
    });

    // Map best-selling products data
    const bestSellingProductsData = bestSellingProducts.map((item) => ({
      productId: item.product_id,
      name: item["Product.name"],
      image:
        item["Product.images"] && item["Product.images"][0]
          ? `http://localhost:8383/${item["Product.images"][0]}`
          : "https://via.placeholder.com/150",
      totalQuantity: parseInt(item.total_quantity, 10),
    }));

    // 2. Revenue Data (Based on Filters)
    let dateCondition = {};

    if (month && year) {
      // Specific month and year
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month
      dateCondition = {
        [Op.between]: [startDate, endDate],
      };
    } else if (year) {
      // Specific year
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      dateCondition = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Prepare the WHERE clause conditionally
    const whereCondition =
      month || year ? { "$Order.created_at$": dateCondition } : {};

    // Fetch total revenue and units sold
    const revenueData = await OrderItem.findOne({
      include: [
        {
          model: Product,
          where: { farmer_id: farmerId },
          attributes: [],
        },
        {
          model: Order,
          attributes: [],
          required: true,
        },
      ],
      attributes: [
        [
          fn("SUM", literal(`"OrderItem"."quantity" * "OrderItem"."price"`)),
          "total_revenue",
        ],
        [fn("SUM", col("OrderItem.quantity")), "total_units_sold"],
      ],
      ...(month || year
        ? { where: { "$Order.created_at$": dateCondition } }
        : {}),
      raw: true, // Return plain object
      subQuery: false, // Prevent subquery generation
    });

    const totalRevenue = parseFloat(revenueData.total_revenue) || 0;
    const totalUnitsSold = parseInt(revenueData.total_units_sold, 10) || 0;

    // 3. Total Number of Orders
    const ordersData = await Order.findAndCountAll({
      include: [
        {
          model: OrderItem,
          required: true,
          include: [
            {
              model: Product,
              where: { farmer_id: farmerId },
              attributes: [],
            },
          ],
        },
      ],
      ...(month || year ? { where: { created_at: dateCondition } } : {}),
      distinct: true,
      col: "Order.id",
      raw: true, // Return plain object
      subQuery: false, // Prevent subquery generation
    });

    const totalOrders = ordersData.count;

    // Respond with aggregated data
    res.status(200).json({
      bestSellingProducts: bestSellingProductsData,
      totalRevenue,
      totalUnitsSold,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.status(500).json({ message: "Failed to fetch report data" });
  }
};
