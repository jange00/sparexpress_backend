// const express = require("express");
// const router = express.Router();
// const deliveryController = require("../controllers/deliveryController");
// const { authenticateUser, isAdmin } = require("../middlewares/authorizedUser");

// router.post("/", authenticateUser, isAdmin, deliveryController.createDelivery);
// router.patch("/:id", authenticateUser, isAdmin, deliveryController.updateDeliveryStatus);
// router.get("/order/:orderId", authenticateUser, deliveryController.getDeliveryByOrder);

// module.exports = router; 

const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");
const { authenticateUser, isAdmin } = require("../middlewares/authorizedUser");

// Create delivery
router.post("/", authenticateUser, isAdmin, deliveryController.createDelivery);

// Update delivery status
router.patch("/:id", authenticateUser, isAdmin, deliveryController.updateDeliveryStatus);

// Get all deliveries
router.get("/", authenticateUser, isAdmin, deliveryController.getAllDeliveries);

// Delete delivery (soft delete)
router.delete("/:id", authenticateUser, isAdmin, deliveryController.deleteDelivery);

module.exports = router;