const express = require("express")
const router = express.Router()
const {createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getMyOrders} = require("../../controllers/order/orderController")
// const { authenticateUser } = require("../../middlewares/authorizedUser")

router.post(
    '/',
    createOrder
)

router.get(
    '/',
    getAllOrders
)
// router.get(
//     "/my-orders",
//     authenticateUser, 
//     getMyOrders
//     );

router.get(
    '/:id',
    getOrderById
)

router.put(
    '/:id',
    updateOrder
)

router.delete(
    '/:id',
    deleteOrder
)


module.exports = router