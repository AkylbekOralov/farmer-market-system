// routes/authRoutes.js
const express = require("express");
const { registerUser } = require("../controllers/regController");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
