// controllers/buyer/searchController
const { Product, Category, FarmersProfile, User } = require("../../models");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"], // Include category name
        },
        {
          model: FarmersProfile,
          include: [
            {
              model: User,
              attributes: ["username", "profile_picture"], // Include farmer's username and profile picture
            },
          ],
          required: false, // Allow products without FarmersProfile
        },
      ],
      attributes: [
        "id",
        "name",
        "price",
        "quantity",
        "unit_of_measure",
        "description",
        "images",
      ], // Specify the required attributes for Product
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
