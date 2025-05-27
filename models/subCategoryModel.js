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
            required: true
        },
        icon: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Subcategory", subCategorySchema)