const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const upload = require("../middlewares/fileUpload");

// Create product (upload multiple images)
router.post("/", upload.array("image", 10), productController.createProduct);

// Get all products
router.get("/", productController.getAllProduct);

// Get product by ID
router.get("/:id", productController.getProductById);

// Update product (optionally upload new images)
router.put("/:id", upload.array("image", 10), productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
