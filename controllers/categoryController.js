const mongoose = require("mongoose");
const Category = require("../models/categoryModel");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const title = req.body.title?.trim();

        // Validation
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const newCategory = new Category({ title });
        await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
        });

    } catch (err) {
        console.error("Error in createCategory:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (err) {
        console.error("Error in getAllCategories:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category
        });

    } catch (err) {
        console.error("Error in getCategoryById:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const title = req.body.title?.trim();

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required for update"
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { $set: { title } },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });

    } catch (err) {
        console.error("Error in updateCategory:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (err) {
        console.error("Error in deleteCategory:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
