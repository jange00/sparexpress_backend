const mongoose = require("mongoose")

const ratingsSchema = new mongoose.Schema(
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
        },
        ratings: {
            type: Number,
            required: true
        },
        comments: {
            type: String,
            trim: true,
            required: false
        },
        // images: {
        //     type: [String], // Array of image URLs or paths
        //     required: false
        // },   
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Ratings", ratingsSchema)