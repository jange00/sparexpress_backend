const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
        unique: true,
    },
    // filepath: {
    //     type: String
    // }
},
{
    timestamps: true
}
)
module.exports = mongoose.model("Category", categorySchema)