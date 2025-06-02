const mongoose = require("mongoose");
const Wishlist = require("../models/wishlists");

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        userId=req.user._id;

        if ( !productId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Product ID are required",
            });
        }

        // Prevent duplicate wishlist entry
        const existing = await Wishlist.findOne({ userId, productId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist",
            });
        }

        const newWishlist = new Wishlist({ userId, productId });
        await newWishlist.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            data: newWishlist,
        });
    } catch (err) {
        console.error("Add to Wishlist Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Get Wishlist for a User
exports.getWishlistByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const wishlist = await Wishlist.find({ userId })
            .populate("productId");

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            data: wishlist,
        });
    } catch (err) {
        console.error("Get Wishlist Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid wishlist ID",
            });
        }

        const removed = await Wishlist.findByIdAndDelete(id);

        if (!removed) {
            return res.status(404).json({
                success: false,
                message: "Wishlist item not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });
    } catch (err) {
        console.error("Remove from Wishlist Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
