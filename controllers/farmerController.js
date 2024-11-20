const { FarmersProfile, User, Category } = require("../models");
const path = require("path");
const fs = require("fs");

// Fetch Crop Types (Categories)
exports.getCropTypes = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"], // Fetch only the necessary fields
      order: [["name", "ASC"]], // Order alphabetically
    });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching crop types:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Farmer Profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await FarmersProfile.findOne({
      where: { user_id: req.user.id },
      attributes: ["farm_address", "farm_size", "types_of_crops"],
    });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer profile not found" });
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["username", "email", "profile_picture", "phone"],
    });

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePicture: user.profile_picture,
      phone: user.phone,
      farmAddress: farmer.farm_address,
      farmSize: farmer.farm_size,
      crops: farmer.types_of_crops,
    });
  } catch (error) {
    console.error("Error fetching farmer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Farmer Profile
exports.updateFarmerProfile = async (req, res) => {
  const { username, phone, farmAddress, farmSize, crops } = req.body;

  try {
    const farmer = await FarmersProfile.findOne({
      where: { user_id: req.user.id },
    });
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!farmer || !user) {
      return res.status(404).json({ message: "Farmer profile not found" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    farmer.farm_address = farmAddress || farmer.farm_address;
    farmer.farm_size = farmSize || farmer.farm_size;
    farmer.types_of_crops = crops || farmer.types_of_crops;

    await user.save();
    await farmer.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile Picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove old profile picture from the server
    if (user.profile_picture) {
      const oldPath = path.join(__dirname, "../", user.profile_picture);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Error deleting old profile picture:", err);
      });
    }

    // Save the new profile picture
    const profilePicturePath = req.file.path;
    user.profile_picture = profilePicturePath;

    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: profilePicturePath,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Profile Picture
exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove profile picture from the server
    if (user.profile_picture) {
      const oldPath = path.join(__dirname, "../", user.profile_picture);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Error deleting profile picture:", err);
      });

      user.profile_picture = null;
      await user.save();
    }

    res.status(200).json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
};
