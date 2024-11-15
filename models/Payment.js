// models/Payment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Adjust this path to your database config

const Payment = sequelize.define(
  "Payment",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    card_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["VISA", "MASTERCARD", "OTHER"]],
      },
    },
    card_number: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    expire_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    owner_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cvc: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
  },
  {
    tableName: "payments",
    timestamps: false, // Disable automatic timestamps
  }
);

module.exports = Payment;
