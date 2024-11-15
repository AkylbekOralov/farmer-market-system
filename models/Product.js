// models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const FarmersProfile = require("./FarmersProfile");
const Category = require("./Category");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    farmer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FarmersProfile,
        key: "user_id", // Foreign key references user_id in FarmersProfile
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: "id", // Foreign key references id in Category
      },
      onDelete: "SET NULL",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_of_measure: {
      type: DataTypes.STRING,
      defaultValue: "kg",
    },
    inventory_status: {
      type: DataTypes.ENUM("In Stock", "Low Stock", "Out of Stock"),
      defaultValue: "In Stock",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // Store image URLs as an array
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

// Associations
Product.belongsTo(FarmersProfile, { foreignKey: "farmer_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Product;
