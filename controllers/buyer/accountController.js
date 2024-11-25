// controllers/buyer/accountController.js
const { User, BuyersProfile, Payment } = require("../../models");
const path = require("path");
const fs = require("fs");

// Fetch Buyer Profile
exports.getBuyerProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["username", "email", "phone", "profile_picture"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const buyerProfile = await BuyersProfile.findOne({
      where: { user_id: req.user.id },
      attributes: ["delivery_address"],
    });

    const paymentInfo = await Payment.findOne({
      where: { user_id: req.user.id },
      attributes: ["card_number", "expire_date", "owner_name", "cvc"],
    });

    res.status(200).json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      profile_picture: user.profile_picture,
      delivery_address: buyerProfile?.delivery_address || "",
      payment: paymentInfo || null,
    });
  } catch (error) {
    console.error("Error fetching buyer profile:", error.message);
    res.status(500).json({ message: "Failed to fetch buyer profile" });
  }
};

// Update Buyer Profile
exports.updateBuyerProfile = async (req, res) => {
  const { username, phone, deliveryAddress, payment } = req.body;

  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const buyerProfile = await BuyersProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (!user || !buyerProfile) {
      return res.status(404).json({ message: "Buyer profile not found" });
    }

    // Update user table
    user.username = username || user.username;
    user.phone = phone || user.phone;
    await user.save();

    // Update buyers_profile table
    buyerProfile.delivery_address =
      deliveryAddress || buyerProfile.delivery_address;
    await buyerProfile.save();

    // Update payments table
    if (payment) {
      const paymentInfo = await Payment.findOne({
        where: { user_id: req.user.id },
      });

      if (paymentInfo) {
        paymentInfo.card_number = payment.cardNumber || paymentInfo.card_number;
        paymentInfo.expire_date = payment.expireDate || paymentInfo.expire_date;
        paymentInfo.owner_name = payment.ownerName || paymentInfo.owner_name;
        paymentInfo.cvc = payment.cvc || paymentInfo.cvc;
        await paymentInfo.save();
      } else {
        // Create new payment record if none exists
        await Payment.create({
          user_id: req.user.id,
          card_number: payment.cardNumber,
          expire_date: payment.expireDate,
          owner_name: payment.ownerName,
          cvc: payment.cvc,
        });
      }
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating buyer profile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
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
      const oldPath = path.resolve(__dirname, "../", user.profile_picture);
      fs.unlink(oldPath, (err) => {
        if (err)
          console.error("Error deleting old profile picture:", err.message);
      });
    }

    // Save new profile picture
    const profilePicturePath = req.file.path.replace(/\\/g, "/");
    user.profile_picture = profilePicturePath;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: profilePicturePath,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};
