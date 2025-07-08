const express = require("express")
const router = express.Router()
const shippingAddressController = require("../controllers/shippingAddressController")
const {authenticateUser} = require("../middlewares/authorizedUser")

router.post(
    "/", 
    authenticateUser,
    shippingAddressController.createShippingAddress
)

router.get(
    "/",
    authenticateUser,
    shippingAddressController.getAllShippingAddresses
)
router.get(
    "/users/:userId",
    authenticateUser,
    shippingAddressController.getShippingAddressesByUserId
)
router.get(
    "/users",
    authenticateUser,
    shippingAddressController.getShippingAddressesByUser
)

router.get(
    "/:id",
    shippingAddressController.getShippingAddressById
)

router.put(
    "/:id", 
    shippingAddressController.updateShippingAddress
)

router.delete(
    "/:id",
    shippingAddressController.deleteShippingAddress
)

module.exports = router