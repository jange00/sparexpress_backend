// const express = require("express")
// const router = express.Router()
// const {authenticateUser} = require("../middlewares/authorizedUser")
// const orderController = require("../controllers/orderController")

// router.post(
//     "/", 
//     authenticateUser,
//     orderController.createOrder
// )

// router.get(
//     "/",
//     orderController.getAllOrders
// )

// router.get(
//     "/:id",
//     orderController.getOrderById
// )

// router.put(
//     "/:id",
//     orderController.updateOrder
// )

// router.delete(
//     "/:id",
//     orderController.deleteOrder
// )

// router.get("/users/:userId", orderController.getOrdersByUserId)

// module.exports = router

const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authorizedUser");
const orderController = require("../controllers/orderController");

// Create a new order (requires user to be logged in)
router.post(
    "/", 
    authenticateUser,
    orderController.createOrder
);

// Get all orders (should probably be admin-only in a real app)
router.get(
    "/",
    orderController.getAllOrders
);

// Get a specific order by its ID
router.get(
    "/:id",
    orderController.getOrderById
);

// Get all orders for a specific user
router.get(
    "/users/:userId", authenticateUser,
    orderController.getOrdersByUserId
);

// Update an order (e.g., change status, should likely be admin-only)
router.put(
    "/:id",
    orderController.updateOrder
);

// Delete an order (should likely be admin-only)
router.delete(
    "/:id",
    orderController.deleteOrder
);

module.exports = router;