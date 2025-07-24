const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
  deliveryStatus: { type: String, enum: ["Pending", "Out for Delivery", "Delivered", "Failed"], default: "Pending" },
  deliveredAt: { type: Date },
  deliveryAgent: { type: String }, // or ref to a User/Agent model
  notes: { type: String },
  proofOfDelivery: { type: String }, // e.g., image URL
}, { timestamps: true });

module.exports = mongoose.model("Delivery", deliverySchema); 