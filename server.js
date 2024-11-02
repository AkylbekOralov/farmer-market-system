const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const authRoutes = require("./auth"); // Import the authorization routes
const regRoutes = require("./reg"); // Import the registration routes
const admRoutes = require("./admin"); // Import the admin routes
const publicRoutes = require("./public"); // Import the public routes
const farmerRoutes = require("./farmer"); // Import the farmer routes

const app = express();
const port = 8383;

// Connecting to PostgreSQL
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2026",
  database: "farmer_market_db",
  port: 5432,
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to PostgreSQL database!");
});

// Middleware
app.use(cors());
app.use(express.json());

// Use routes from other files
app.use(authRoutes); // Mount the authorization routes at /auth
app.use(regRoutes); // Mount the registration routes at /reg
app.use(admRoutes); // Mount the admin routes at /admin
app.use(publicRoutes); // Mount the public routes at /public
app.use(farmerRoutes); // Mount the public routes at /public

// Hosting
app.listen(port, () => console.log(`Server has started on port: ${port}`));
