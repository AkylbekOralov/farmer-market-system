// models/FarmersProfile.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const FarmersProfile = sequelize.define(
  "FarmersProfile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "id" },
      primaryKey: true,
    },
    farm_address: DataTypes.STRING,
    farm_size: DataTypes.DECIMAL(10, 2),
    types_of_crops: DataTypes.ARRAY(DataTypes.TEXT),
    iin: DataTypes.STRING,
  },
  {
    tableName: "farmers_profile",
    timestamps: false,
  }
);

module.exports = FarmersProfile;
