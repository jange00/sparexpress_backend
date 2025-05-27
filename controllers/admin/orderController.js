const Order = require("../../models/orderModel");

// Generate readable order ID
const generateOrderId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${random}`;
};

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    const total = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    const order = new Order({
      ...req.body,
      total,
      id: generateOrderId(),
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created",
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({
      success: true,
      message: "Orders fetched",
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order fetched",
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update order by ID
exports.updateOrder = async (req, res) => {
  try {
    const updateData = req.body;

    // If items are updated, recalculate total
    if (updateData.items) {
      updateData.total = updateData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete order by ID (MongoDB _id)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, message: "Order deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
