const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        // no need to keep model 
        model: {
            type: String,
            required : false
        }
    },
    {
        timestamps: true // Optional, but good for tracking
    }
)
module.exports = mongoose.model("Brand", brandSchema)