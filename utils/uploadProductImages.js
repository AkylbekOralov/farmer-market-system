const multer = require("multer");
const path = require("path");

// Configure storage for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product_images"); // Directory for product images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer instance for product images
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit per image
});

module.exports = upload; // Export multer instance
