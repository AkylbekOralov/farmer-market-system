// models/ChatConversation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BuyersProfile = require("./BuyersProfile");
const FarmersProfile = require("./FarmersProfile");

const ChatConversation = sequelize.define(
  "ChatConversation",
  {
    conversation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BuyersProfile,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    farmer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FarmersProfile,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chat_conversations",
    timestamps: false,
  }
);

module.exports = ChatConversation;
