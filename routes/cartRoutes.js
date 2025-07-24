const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const {authenticateUser}=require("../middlewares/authorizedUser")

// Add product to cart
router.post("/", authenticateUser,cartController.addToCart);

// Get cart items by userId
router.get("/user",authenticateUser, cartController.getCartByUserId);

// Remove a specific cart item by its ID
router.delete("/item/:cartItemId", cartController.removeFromCart);

// Clear all items in the cart for a specific user
router.delete("/clear/:userId", cartController.clearCart);

router.put('/item/:cartItemId', cartController.updateCartItem);

module.exports = router;
