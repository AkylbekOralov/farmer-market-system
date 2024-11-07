// models/BuyersProfile.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const BuyersProfile = sequelize.define(
  "BuyersProfile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "id" },
      primaryKey: true,
    },
    delivery_address: DataTypes.STRING,
    payment_method: DataTypes.STRING,
  },
  {
    tableName: "buyers_profile",
    timestamps: false,
  }
);

module.exports = BuyersProfile;
