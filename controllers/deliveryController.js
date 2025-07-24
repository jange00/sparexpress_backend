const Delivery = require("../models/deliveryModel");

exports.createDelivery = async (req, res) => {
  try {
    const { orderId, deliveryAgent } = req.body;
    const delivery = new Delivery({ orderId, deliveryAgent });
    await delivery.save();
    res.status(201).json({ success: true, data: delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create delivery", error: err.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus, notes, proofOfDelivery } = req.body;
    const update = { deliveryStatus, notes, proofOfDelivery };
    if (deliveryStatus === "Delivered") update.deliveredAt = new Date();
    const delivery = await Delivery.findByIdAndUpdate(id, update, { new: true });
    if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update delivery", error: err.message });
  }
};

exports.getDeliveryByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });
    if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch delivery", error: err.message });
  }
}; 