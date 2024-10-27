const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const { validate } = require("deep-email-validator");

const app = express();
const port = 8383;

// Connecting to mysql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2026",
  database: "farmer_market_db", // Make sure to add your database name here
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

app.use(cors());
app.use(express.json());

// Registration endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate the email
    const validationResult = await validate(email);

    if (!validationResult.valid) {
      return res.status(400).send({
        status: "error",
        message: "Email is not valid. Please try again!",
        reason: validationResult.reason,
      });
    }

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    con.query(sql, [email, password], (err, result) => {
      if (err) {
        console.error("Error inserting user data:", err);
        return res.status(500).send("Registration failed");
      }
      res.status(201).send("User registered successfully");
      console.log(`Added new user: ${email}`);
    });
  } catch (error) {
    console.error("Error during email validation:", error);
    res.status(500).send("Email validation failed");
  }
});

// Hosting
app.listen(port, () => console.log(`Server has started on port: ${port}`));
