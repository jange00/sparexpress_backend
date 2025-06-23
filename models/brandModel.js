const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    count: {
      type: Number,
      required: true
    },
    model: {
      type: String,
      required: false
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Brand", brandSchema);
