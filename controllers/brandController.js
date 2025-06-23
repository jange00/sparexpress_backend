// 

const mongoose = require("mongoose");
const Brand = require("../models/brandModel");

// Create a new brand
exports.createBrand = async (req, res) => {
    try {
        const title = req.body.title?.trim();
        console.log(req.body)
        const model = req.body.model?.trim();
        const count = Number(req.body.count);
        const categoryId = req.body.categoryId;
        const subcategoryId = req.body.subcategoryId;

        if (!title || isNaN(count) || !categoryId || !subcategoryId) {
            return res.status(400).json({
                success: false,
                message: "Fields title, count, categoryId, and subcategoryId are required and must be valid."
            });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid categoryId or subcategoryId"
            });
        }

        const newBrand = new Brand({
            title,
            count,
            model,
            categoryId,
            subcategoryId
        });

        await newBrand.save();

        return res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: newBrand
        });

    } catch (err) {
        console.error("Error in createBrand:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
            .populate("categoryId", "title")
            .populate("subcategoryId", "title");

        return res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: brands
        });
    } catch (err) {
        console.error("Error in getAllBrands:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get a single brand by ID
exports.getBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid brand ID"
            });
        }

        const brand = await Brand.findById(id)
            .populate("categoryId", "title")
            .populate("subcategoryId", "title");

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data: brand
        });

    } catch (err) {
        console.error("Error in getBrandById:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update a brand by ID
exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, subcategoryId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid brand ID"
            });
        }

        if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid categoryId"
            });
        }

        if (subcategoryId && !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategoryId"
            });
        }

        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data: updatedBrand
        });

    } catch (err) {
        console.error("Error in updateBrand:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete a brand by ID
exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid brand ID"
            });
        }

        const brand = await Brand.findByIdAndDelete(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });

    } catch (err) {
        console.error("Error in deleteBrand:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
