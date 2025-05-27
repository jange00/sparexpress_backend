const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role : {
            type: String,
            default: "Customer",
            enum: ["Admin","Customer"],
        },
        profilePicture: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("User", UserSchema);