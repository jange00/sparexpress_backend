const mongoose = require("mongoose");
const Brand = require("../models/brandModel");

// Create a new brand
exports.createBrand = async (req, res) => {
    try {
        const title = req.body.title?.trim();
        const model = req.body.model?.trim();
        const count = Number(req.body.count);

        if (!title || !model || isNaN(count)) {
            return res.status(400).json({
                success: false,
                message: "All fields (title, count, model) are required and valid"
            });
        }

        const newBrand = new Brand({
            title,
            count,
            model
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
        const brands = await Brand.find();
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

        const brand = await Brand.findById(id);
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid brand ID"
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
