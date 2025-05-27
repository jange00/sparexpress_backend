const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema({
  material: String,
  position: String,
  fitment: String,
  warranty: String,
  dimensions: String,
  weight: String,
  features: [String],
  compatibility: [String]
});

module.exports = mongoose.model("Specification", specificationSchema);
