// controllers/admin/usersController.js
const { User } = require("../../models");
const { FarmersProfile } = require("../../models");

exports.verifyUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(404).json({ message: "Admins cannot be verified" });
    }

    // If the user is already verified, send a response
    if (user.admin_verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Update the user's `admin_verified` field to true
    user.admin_verified = true;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUnverifiedFarmers = async (req, res) => {
  try {
    // Find all unverified farmers
    const unverifiedFarmers = await User.findAll({
      where: {
        role: "farmer",
        admin_verified: false,
      },
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "profile_picture",
        "email_verified",
        "admin_verified",
        "created_at",
      ],
      include: [
        {
          model: FarmersProfile,
          as: "FarmersProfile", // Use the alias defined in the association
          attributes: ["farm_address", "farm_size", "types_of_crops", "iin"],
        },
      ],
    });

    // Return the list of unverified farmers
    res.status(200).json({
      message: "List of unverified farmers",
      data: unverifiedFarmers,
    });
  } catch (error) {
    console.error("Error fetching unverified farmers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deactivateuser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(404).json({ message: "Admins cannot be diactivated" });
    }

    // If the user is already diactivated, send a response
    if (!user.admin_verified) {
      return res.status(400).json({ message: "User is already diactivated" });
    }

    // Update the farmer's `admin_verified` field to true
    user.admin_verified = false;
    await user.save();

    res.status(200).json({ message: "User diactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
