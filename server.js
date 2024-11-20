// server.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./config/db");

// Import your route files
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const publicRoutes = require("./routes/publicRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/public", publicRoutes);

// Test database connection and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.error(err.stack); // To get more details about the error
  });
