const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const authRoutes = require("./auth");
const regRoutes = require("./reg"); // Import the registration routes

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

app.use(cors());
app.use(express.json());

// Use routes from other files
app.use(authRoutes);
app.use(regRoutes); // Mount the registration routes

// Hosting
app.listen(port, () => console.log(`Server has started on port: ${port}`));
