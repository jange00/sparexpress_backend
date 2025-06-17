const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: null
        },
        icon: {
            type: String,
            required: null
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Subcategory", subCategorySchema)