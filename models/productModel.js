const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true
  },

  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true
  },

  price: { type: Number, required: true },
  
  image: [{ type: String, required: true }],

  description: { type: String },

  stock: { type: Number, required: true },

  shippingCharge: { type: Number, required: true },

  discount: { type: Number },

  specificationsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specification",
    required: null 
  },
  
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
