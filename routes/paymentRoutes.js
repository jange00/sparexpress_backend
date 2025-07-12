const express = require("express")
const router = express.Router()
const paymentController = require("../controllers/paymentController")
const {authenticateUser} = require("../middlewares/authorizedUser")

router.post(
    "/",
    authenticateUser,
    paymentController.createPayment
)

router.get(
    "/", 
    authenticateUser,
    paymentController.getAllPayments
)

router.get(
    "/:id",
    paymentController.getPaymentById
)

router.put(
    "/:id", 
    paymentController.updatePayment
)

router.delete(
    "/:id",
    paymentController.deletePayment
)

// New route to get payments by user ID
router.get(
    "/users/:userId", 
    authenticateUser,
    paymentController.getPaymentsByUserId);

module.exports = router