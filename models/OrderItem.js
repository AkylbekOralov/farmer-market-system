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
      type: DataTypes.DECIMAL(10, 2), // Allow decimal values for quantity
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

module.exports = OrderItem;
