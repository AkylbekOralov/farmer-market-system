// controllers/buyer/cartController
const { Cart, Product } = require("../../models");

// Add product to the cart
exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  try {
    // Check if the product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the quantity requested is available
    if (quantity > product.quantity) {
      return res
        .status(400)
        .json({ message: "Requested quantity exceeds available stock" });
    }

    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({
      where: { buyer_id: user_id, product_id },
    });

    if (existingCartItem) {
      // Update quantity and price if the product is already in the cart
      const updatedQuantity = existingCartItem.quantity + quantity;

      // Check if the total quantity exceeds the available stock
      if (updatedQuantity > product.quantity) {
        return res
          .status(400)
          .json({ message: "Requested quantity exceeds available stock" });
      }

      existingCartItem.quantity = updatedQuantity;
      existingCartItem.price = updatedQuantity * product.price;

      await existingCartItem.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cartItem: existingCartItem,
      });
    }

    // Add a new product to the cart
    const cartItem = await Cart.create({
      buyer_id: user_id,
      product_id,
      quantity,
      price: product.price * quantity,
    });

    res.status(201).json({
      message: "Product added to cart successfully",
      cartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

// Get the buyer's cart
exports.getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const cartItems = await Cart.findAll({
      where: { buyer_id: user_id },
      attributes: ["id", "quantity", "price"],
      include: [
        {
          model: Product,
          as: "cart_product", // Use the updated alias
          attributes: ["id", "name", "images", "price", "unit_of_measure"],
        },
      ],
    });

    const cartDetails = cartItems.map((item) => ({
      cart_id: item.id,
      quantity: item.quantity,
      price: item.price,
      product: item.cart_product, // Use the updated alias
    }));

    res.status(200).json({ cart: cartDetails });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  const { cart_id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if the cart item exists
    const cartItem = await Cart.findOne({
      where: { id: cart_id, buyer_id: user_id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;

  try {
    // Check if quantity is provided and valid
    if (quantity == null || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    const cartItem = await Cart.findByPk(cart_id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Ensure the quantity does not exceed the product's available stock
    const product = await Product.findByPk(cartItem.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.quantity) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
      });
    }

    // Update the cart item's quantity
    cartItem.quantity = quantity;
    cartItem.price = quantity * product.price;
    await cartItem.save();

    res.status(200).json({ message: "Cart updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Failed to update cart quantity" });
  }
};
