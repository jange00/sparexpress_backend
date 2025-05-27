const mongoose = require("mongoose")

const wishListsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    },
    {
        timestamps: true // Optional, but good for tracking
    }
)

module.exports = mongoose.model("Wishlists", wishListsSchema)