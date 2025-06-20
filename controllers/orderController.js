const mongoose = require("mongoose");
const Order = require("../models/orderModel");

// Create a new order
exports.createOrder = async (req, res) => {
    const {Amount, shippingAddressId, paymentMethodId,  } = req.fields;
    console.log(req.fields)
    const items = JSON.parse(req.fields.items);
    const amount = Number(Amount);
    
    try {
        
       
        userId=req.user._id;

        // Validate required fields
        if (
            !shippingAddressId ||
            !paymentMethodId ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0 ||
            isNaN(amount)
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid order data"
            });
        }

        const newOrder = new Order({
            userId,
            Amount: amount,
            shippingAddressId,
            paymentMethodId,
            items
        });

        await newOrder.save();

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder
        });

    } catch (err) {
        console.error("Create order error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "fullname email phoneNumber")
            .populate("shippingAddressId")
            .populate("paymentMethodId")
            .populate("items.productId", "name price");

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });

    } catch (err) {
        console.error("Get all orders error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(id)
            .populate("userId", "fullname email phoneNumber")
            .populate("shippingAddressId")
            .populate("paymentMethodId")
            .populate("items.productId", "name price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });

    } catch (err) {
        console.error("Get order by ID error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: updatedOrder
        });

    } catch (err) {
        console.error("Update order error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (err) {
        console.error("Delete order error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
