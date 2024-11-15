// models/Category.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure the category name is unique
    },
  },
  {
    tableName: "categories",
    timestamps: false, // Disable timestamps for this table
  }
);

module.exports = Category;
