const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

// Nodemailer setup for sending email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oralovv26@gmail.com", // Use your Gmail
    pass: "puhj lkym tpdh wxrj", // Use an app-specific password
  },
});

// Registration endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate the email whether it is real or not
    const validationResult = await validate(email);

    if (!validationResult.valid) {
      return res.status(400).send({
        status: "error",
        message: "Email is not valid. Please try again!",
        reason: validationResult.reason,
      });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const sql =
      "INSERT INTO users (email, password, isVerified, verificationToken) VALUES (?, ?, ?, ?)";
    con.query(
      sql,
      [email, password, false, verificationToken],
      (err, result) => {
        if (err) {
          console.error("Error inserting user data:", err);
          return res.status(500).send("Registration failed");
        }

        // Send verification email
        const verificationLink = `http://localhost:8383/verify-email?token=${verificationToken}`;
        const mailOptions = {
          from: "oralovv26@gmail.com",
          to: email,
          subject: "Verify Your Email",
          text: `Please click the link to verify your email: ${verificationLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending verification email:", error);
            return res.status(500).send("Could not send verification email");
          }
          res
            .status(201)
            .send("User registered successfully. Verification email sent.");
          console.log(`Added new user: ${email} and sent verification email.`);
        });
      }
    );
  } catch (error) {
    console.error("Error during email validation:", error);
    res.status(500).send("Email validation failed");
  }
});

// Email verification endpoint
app.get("/verify-email", (req, res) => {
  const { token } = req.query;

  const sql = "UPDATE users SET isVerified = ? WHERE verificationToken = ?";
  con.query(sql, [true, token], (err, result) => {
    if (err || result.affectedRows === 0) {
      console.error("Error verifying email or token not found:", err);
      return res.status(400).send("Invalid or expired token");
    }

    res.send("Email verified successfully!");
  });
});

// Hosting
app.listen(port, () => console.log(`Server has started on port: ${port}`));
