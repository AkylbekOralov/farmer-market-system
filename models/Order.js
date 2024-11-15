// models/Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BuyersProfile = require("./BuyersProfile");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BuyersProfile,
        key: "user_id", // Foreign key references user_id in BuyersProfile
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled"
      ),
      defaultValue: "Pending",
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tracking_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

module.exports = Order;
