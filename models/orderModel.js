const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true
        // },

        
        
        customer: {
            fullname: { type: String, required: true },
            email: { type: String, required: true },
            phoneNumber: { type: String, required: true }
          },
        date: {
            type: Date,
            default: Date.now
        },
        total: Number,
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "canceled"
            ]
        },
        paymentMethod: {
            type: String,
            enum: ["credit-card", "paypal", "bank-transfer", "cash-on-delivery"],
            required: true
          },
        paymentStatus: { type: String, enum: ["paid", "unpaid", "refunded"] },
        items: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product
                name: String,
                price: Number,
                quantity: Number,
                total: Number
            }
        ],
        shipping: {
            address: String,
            courier: String,
            trackingId: String,
            estimatedDeliver: String
        },
        notes: String,
    }
)

module.exports = mongoose.model('Order', orderSchema)