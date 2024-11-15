// models/AuditLog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allows NULL if the user is deleted
      references: {
        model: User,
        key: "id",
      },
      onDelete: "SET NULL",
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    details: {
      type: DataTypes.JSONB, // Use JSONB for flexible storage of additional details
      allowNull: true,
    },
  },
  {
    tableName: "audit_logs",
    timestamps: false,
  }
);

module.exports = AuditLog;
