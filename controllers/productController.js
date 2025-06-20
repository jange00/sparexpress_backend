const mongoose = require("mongoose");
const Product = require("../models/productModel");

// Create Product
exports.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    categoryId,
    subCategoryId,
    brandId,
    stock,
    shippingCharge,
    discount,
    // specificationsId,
  } = req.body;
  try {
    


    console.log(req.body)
    if (!name || !price || !categoryId || !subCategoryId || !brandId || !stock || !shippingCharge) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Multiple image upload
    const imagePaths = req.files?.map(file => file.path) || [];
    if (imagePaths.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      categoryId,
      subCategoryId,
      brandId,
      stock,
      shippingCharge,
      discount,
      // specificationsId,
      image: imagePaths
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    });

  } catch (err) {
    console.error("Create Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get All Products
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "title")
      .populate("subCategoryId", "title")
      .populate("brandId", "title")
      // .populate("specificationsId");

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products
    });
  } catch (err) {
    console.error("Get All Products Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(id)
      .populate("categoryId", "title")
      .populate("subCategoryId", "title")
      .populate("brandId", "title")
      // .populate("specificationsId");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product
    });
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const imagePaths = req.files?.map(file => file.path) || [];

    const updatedData = {
      ...req.body,
      ...(imagePaths.length > 0 && { image: imagePaths })
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (err) {
    console.error("Update Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
