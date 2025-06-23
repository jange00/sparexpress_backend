const mongoose = require("mongoose");
const Payment = require("../models/paymentModel");

// Create a new payment 
exports.createPayment = async (req, res) => {
    try {
        const { orderId, amount, paymentMethod, paymentStatus  } = req.body;
        userId=req.user._id;

        // Basic validation
        if ( !orderId || !amount || !paymentMethod || isNaN(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid required fields"
            });
        }

        const newPayment = new Payment({
            userId,
            orderId,
            amount: Number(amount),
            paymentMethod,
            paymentStatus
        });

        await newPayment.save();

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: newPayment
        });

    } catch (err) {
        console.error("Create payment error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while creating payment"
        });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("userId", "fullname email phoneNumber")
            .populate("orderId");

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: payments
        });

    } catch (err) {
        console.error("Get all payments error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching payments"
        });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }

        const payment = await Payment.findById(id)
            .populate("userId", "fullname email phoneNumber")
            .populate("orderId");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            data: payment
        });

    } catch (err) {
        console.error("Get payment by ID error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching payment"
        });
    }
};

// Update payment
exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: updatedPayment
        });

    } catch (err) {
        console.error("Update payment error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while updating payment"
        });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment ID"
            });
        }

        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });

    } catch (err) {
        console.error("Delete payment error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting payment"
        });
    }
};


// Get payments by user ID
exports.getPaymentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(req.params)

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const payments = await Payment.find({ userId })
            .populate("userId", "fullname email phoneNumber")
            .populate("orderId");
            // console.log(payments);

        if (!payments.length) {
            return res.status(404).json({
                success: false,
                message: "No payments found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: payments
        });
    } catch (err) {
        console.error("Get payments by user ID error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching payments by user"
        });
    }
};
