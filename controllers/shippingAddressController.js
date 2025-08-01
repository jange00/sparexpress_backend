const mongoose = require("mongoose")
const ShippingAddress = require("../models/shipment_addressModel")

// Create a new shipping address
exports.createShippingAddress = async (req, res) => {
    const { streetAddress, postalCode, city, district, province, country} = req.body
    userId=req.user._id;
    // const userId = req.body.userId || req.user._id;
    console.log(req.body)
    try{

        if(!streetAddress || !postalCode || !city || !district || !province || !country) {
            return res.status(404).json({
                success : false,
                message : "All fields are required"
            })
        }

        // if(!mongoose.Types.ObjectId.isValid(userId)) {
        //     return res.status(404).json({
        //         success : false,
        //         message : "Invalid user ID"
        //     })
        // }

        const newAddress = new ShippingAddress({
            streetAddress,
            postalCode,
            city,
            district,
            province,country,
            userId
        })
        await newAddress.save()
        return res.status(201).json({
            success : true,
            message : "Shipping address created successfully",
            data : newAddress
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "Failed to create shipping address"
        })
    }
}

// Get all shipping address
exports.getAllShippingAddresses = async (req, res) => {
    try{
        const shippingAddresses = await ShippingAddress.find()
        .populate("userId", "fullname email phoneNumber")

        return res.status(200).json({
            success : true,
            message : "Shipping address fetched successfully",
            data : shippingAddresses
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Failed to fetch shipping address"
        })
    }
}

// Get shipping address by ID
exports.getShippingAddressById = async (req, res) => {
    try{
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success : false,
                message : "Invalid shipping address ID"
            })
        }

        const address = await ShippingAddress.findById(id)
        .populate("userId", "fullname email phoneNumber")

        if(!address) {
            return res.status(404).json({
                success : false,
                message : "Shipping address are not found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Shipping address fetched successfully",
            data : address
        })
    }catch(err){
        return res.status(500).json({
            success : true,
            message : "Failed to fetch the shipping address"
        })
    }
}

// update shipping address by ID
exports.updateShippingAddress = async (req, res) => {
    try{
        const { id } = req.params

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success : false,
                message : "Invalid shipping address ID"
            })
        }

        const updateAddress = await ShippingAddress.findByIdAndUpdate(
            id,
            {$set: req.body},
            {new: true}
        )

        if(!updateAddress) {
            return res.status(404).json({
                success : false,
                message : "Shipping address not found"
            })
        }
        return res.status(200).json({
            success : true,
            message : "Shipping address updated successfully",
            data : updateAddress
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Failed to update shipping address"
        })
    }
}

// Delete shipping address by ID
exports.deleteShippingAddress = async (req, res) => {
    try{
        const { id } = req.body

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success : false,
                message : "Invalid shipping address ID"
            })
        }

        const deleteAddress = await ShippingAddress.findByIdAndDelete(id)

        if(!deleteAddress) {
            return res.status(404).json({
                success : false,
                message : "Shipping address not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Shipping address deleted successfully"
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Failed to delete shipping address"
        })
    }
}

// Get shipping addresses by user ID
exports.getShippingAddressesByUserId = async (req, res) => {
    try {
        const {userId }= req.params;
        console.log(req.params)

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const addresses = await ShippingAddress.find({ userId })
            .populate("userId", "fullname email phoneNumber");

        if (addresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No shipping addresses found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shipping addresses fetched successfully",
            data: addresses
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch shipping addresses"
        });
    }
};

exports.getShippingAddressesByUser = async (req, res) => {
    const userId=req.user._id;
       
    try {
        

        if (!mongoose.Types.ObjectId.isValid(
            userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const addresses = await ShippingAddress.find({ 
            userId })
            .populate("userId", "fullname email phoneNumber");

        if (addresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No shipping addresses found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shipping addresses fetched successfully",
            data: addresses
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch shipping addresses"
        });
    }
};

