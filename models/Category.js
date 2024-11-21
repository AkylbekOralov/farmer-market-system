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
      unique: true, // Ensures no duplicate category names
    },
  },
  {
    tableName: "categories",
    timestamps: false, // No created_at or updated_at fields
  }
);

module.exports = Category;

