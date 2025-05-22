const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  image: { type: String, required: true },
  badge: { type: String },
  description: { type: String },
  stock: { type: Number, required: true },
  discount: { type: Number },
  inStock: { type: Boolean, default: true },
  specifications: {
    material: String,
    position: String,
    fitment: String,
    warranty: String,
    dimensions: String,
    weight: String
  },
  features: [String],
  compatibility: [String]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
