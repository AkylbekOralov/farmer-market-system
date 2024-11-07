// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    role: DataTypes.ENUM("farmer", "buyer", "admin"),
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "users", // Specify the table name in lowercase
    timestamps: false,
  }
);

module.exports = User;
