const Cart = require("../models/cartModel");

// Add product to cart
exports.addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId=req.user._id
  try {

    
    

    // Check if product already in cart
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    const newCartItem = new Cart({ userId, productId });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

// Get all items in cart for a user
exports.getCartByUserId = async (req, res) => {
  const userId=req.user._id
  try {

    const cartItems = await Cart.find({ userId }).populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart items", error });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const deletedItem = await Cart.findByIdAndDelete(cartItemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error });
  }
};

// Clear all cart items for a user
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};
