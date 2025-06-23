const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        Amount: {
            type: Number,
            required: true,
            min: 0
        },
        shippingAddressId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingAddress",
            required: true
        },
        paymentMethodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            required: true
        },
        orderStatus: {
            type: String,
            trim: true,
            required: true,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
          },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                total: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ]
    },
    {
        timestamps: true // Optional, but good for tracking
    }
)

module.exports = mongoose.model('Order', orderSchema)