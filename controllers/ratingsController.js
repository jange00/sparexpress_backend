const mongoose = require("mongoose");
const Ratings = require("../models/ratingsModel");

// Create a new rating
exports.createRating = async (req, res) => {
    try {
        const newRating = new Ratings(req.body);
        await newRating.save();

        return res.status(200).json({
            success: true,
            message: "Rating created successfully",
            data: newRating
        });
    } catch (err) {
        console.error("Create Rating Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create rating"
        });
    }
};

// Get all ratings
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Ratings.find()
            .populate("userId", "fullname email phoneNumber")
            .populate("productId", "name");

        return res.status(200).json({
            success: true,
            message: "Ratings fetched successfully",
            data: ratings
        });
    } catch (err) {
        console.error("Get All Ratings Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch ratings"
        });
    }
};

// Get rating by ID
exports.getRatingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rating ID"
            });
        }

        const rating = await Ratings.findById(id)
            .populate("userId", "fullname email phoneNumber")
            .populate("productId", "name");

        if (!rating) {
            return res.status(404).json({
                success: false,
                message: "Rating not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating fetched successfully",
            data: rating
        });
    } catch (err) {
        console.error("Get Rating By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch rating"
        });
    }
};

// Update rating by ID
exports.updateRating = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rating ID"
            });
        }

        const updateRating = await Ratings.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updateRating) {
            return res.status(404).json({
                success: false,
                message: "Rating not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating updated successfully",
            data: updateRating
        });
    } catch (err) {
        console.error("Update Rating Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update rating"
        });
    }
};

// Delete rating by ID
exports.deleteRating = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid rating ID"
            });
        }

        const deleteRating = await Ratings.findByIdAndDelete(id);

        if (!deleteRating) {
            return res.status(404).json({
                success: false,
                message: "Rating not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating deleted successfully"
        });
    } catch (err) {
        console.error("Delete Rating Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete rating"
        });
    }
};
