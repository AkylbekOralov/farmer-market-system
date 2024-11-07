// server.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test database connection and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
