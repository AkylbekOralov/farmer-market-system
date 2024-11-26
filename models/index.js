// models/index.js
const User = require("./User");
const FarmersProfile = require("./FarmersProfile");
const BuyersProfile = require("./BuyersProfile");
const Payment = require("./Payment");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Category = require("./Category");
const Cart = require("./Cart");

// Initialize associations
User.hasOne(FarmersProfile, { foreignKey: "user_id", as: "FarmersProfile" });
FarmersProfile.belongsTo(User, { foreignKey: "user_id" });

FarmersProfile.hasMany(Product, { foreignKey: "farmer_id" });
Product.belongsTo(FarmersProfile, { foreignKey: "farmer_id" });

BuyersProfile.hasMany(Order, { foreignKey: "buyer_id" });
Order.belongsTo(BuyersProfile, { foreignKey: "buyer_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

module.exports = {
  User,
  FarmersProfile,
  BuyersProfile,
  Payment,
  Product,
  Order,
  OrderItem,
  Category,
  Cart,
};
