// routes/authRoutes.js
const express = require("express");
const { verifyEmail, loginUser } = require("../controllers/authController");
const { registerUser, registerAdmin } = require("../controllers/regController");
const upload = require("../utils/upload");

const router = express.Router();

// router.post("/register", registerUser);
router.post("/register", upload.single("profile_picture"), registerUser);
router.post("/register-admin", registerAdmin);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);

module.exports = router;
