const express = require("express")
const router = express.Router()
const {authenticateUser} = require("../middlewares/authorizedUser")
const orderController = require("../controllers/orderController")

router.post(
    "/", 
    authenticateUser,
    orderController.createOrder
)

router.get(
    "/",
    orderController.getAllOrders
)

router.get(
    "/:id",
    orderController.getOrderById
)

router.put(
    "/:id",
    orderController.updateOrder
)

router.delete(
    "/:id",
    orderController.deleteOrder
)

module.exports = router