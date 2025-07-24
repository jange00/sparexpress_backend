const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");
const { authenticateUser, isAdmin } = require("../middlewares/authorizedUser");

router.post("/", authenticateUser, isAdmin, deliveryController.createDelivery);
router.patch("/:id", authenticateUser, isAdmin, deliveryController.updateDeliveryStatus);
router.get("/order/:orderId", authenticateUser, deliveryController.getDeliveryByOrder);

module.exports = router; 