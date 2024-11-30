// models/OrderItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./Order");
const Product = require("./Product");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
        // If you're using Sequelize associations, you might not need to specify 'references' and 'onDelete' here.
      },
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2), // Allows decimal values for quantity
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]],
      },
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

// If you have associations defined elsewhere, ensure they are correctly set up.

module.exports = OrderItem;
