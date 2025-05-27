const mongoose = require("mongoose")

const shippingAddressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        streetAddress: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        district: {
            type: String,
            required: true,
            trim: true
        },
        province: { 
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true // Optional, but good for tracking
    }
)

module.exports = mongoose.model("ShippingAddress", shippingAddressSchema)