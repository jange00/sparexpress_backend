const mongoose = require("mongoose");
const Product = require("../models/productModel");

// Create product
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, categoryId, subCategoryId, brandId, specificationId } = req.body;

        // Optional: basic validation
        if (!title || !price || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Title, price, and categoryId are required"
            });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            categoryId,
            subCategoryId,
            brandId,
            specificationId
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

// Get all products
exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("categoryId", "title")
            .populate("subCategoryId", "title")
            .populate("brandId", "title")
            .populate("specificationId");

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

// Get product by ID
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
            .populate("specificationId");

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

// Update product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

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

// Delete product by ID
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
