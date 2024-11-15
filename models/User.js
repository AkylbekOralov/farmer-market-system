// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-increment for the ID field
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure username is unique
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure email is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("farmer", "buyer", "admin"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.TEXT, // Store the image URL or base64 encoded string
      allowNull: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to false for email verification
    },
    admin_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to false for admin verification
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically sets the timestamp for creation
    },
  },
  {
    tableName: "users", // Table name in lowercase
    timestamps: false, // We'll use `created_at` as the timestamp
    underscored: true, // Use snake_case in the database (optional, you can skip this if you prefer camelCase)
  }
);

module.exports = User;
