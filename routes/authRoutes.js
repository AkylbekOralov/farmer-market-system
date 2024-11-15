// routes/authRoutes.js
const express = require("express");
const { verifyEmail, loginUser } = require("../controllers/authController");
const { registerUser, registerAdmin } = require("../controllers/regController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-admin", registerAdmin);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);

module.exports = router;
