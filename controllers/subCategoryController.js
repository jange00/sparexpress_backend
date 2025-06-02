const mongoose = require("mongoose");
const Subcategory = require("../models/subCategoryModel");

// Create Subcategory
exports.createSubCategory = async (req, res) => {
    try {
        const { categoryId, title, description, icon } = req.body;

        if (!categoryId || !title || !description || !icon) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newSubCategory = new Subcategory({ categoryId, title, description, icon });
        await newSubCategory.save();

        return res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            data: newSubCategory,
        });
    } catch (err) {
        console.error("Create Subcategory Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Get all Subcategories
exports.getAllSubCategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate("categoryId", "title");

        return res.status(200).json({
            success: true,
            message: "Subcategories fetched successfully",
            data: subcategories,
        });
    } catch (err) {
        console.error("Get All Subcategories Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Get Subcategory by ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory ID",
            });
        }

        const subcategory = await Subcategory.findById(id).populate("categoryId", "title");

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subcategory fetched successfully",
            data: subcategory,
        });
    } catch (err) {
        console.error("Get Subcategory By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Update Subcategory by ID
exports.updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory ID",
            });
        }

        const updated = await Subcategory.findByIdAndUpdate(id, { $set: req.body }, { new: true });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: updated,
        });
    } catch (err) {
        console.error("Update Subcategory Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Delete Subcategory
exports.deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory ID",
            });
        }

        const deleted = await Subcategory.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subcategory deleted successfully",
        });
    } catch (err) {
        console.error("Delete Subcategory Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
