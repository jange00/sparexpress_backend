const express = require("express")
const router = express.Router()
const shippingAddressController = require("../controllers/shippingAddressController")

router.post(
    "/", 
    shippingAddressController.createShippingAddress
)

router.get(
    "/",
    shippingAddressController.getAllShippingAddresses
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