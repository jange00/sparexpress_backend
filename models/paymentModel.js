const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            trim: true,
            required: true,
            enum: ["Credit Card", "Debit Card", "Cash on Delivery", "Esewa", "Net Banking", "Other"]
        },
        paymentStatus: {
            type: String,
            trim: true,
            required: true,
            enum: ["Pending", "Completed", "Failed", "Refunded"],
            default: "Pending"
        },
        // paymentDate: {
        //     type: Date,
        //     default: Date.now
        // }
    },
    {
        timestamps: true 
    }
)

module.exports = mongoose.model("Payment", paymentSchema)