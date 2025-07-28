const Delivery = require("../models/deliveryModel");
const Order = require("../models/orderModel"); 

// exports.createDelivery = async (req, res) => {
//   try {
//     const { orderId, deliveryAgent } = req.body;
//     const delivery = new Delivery({ orderId, deliveryAgent });
//     await delivery.save();
//     res.status(201).json({ success: true, data: delivery });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to create delivery", error: err.message });
//   }
// };

// exports.updateDeliveryStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { deliveryStatus, notes, proofOfDelivery } = req.body;
//     const update = { deliveryStatus, notes, proofOfDelivery };
//     if (deliveryStatus === "Delivered") update.deliveredAt = new Date();
//     const delivery = await Delivery.findByIdAndUpdate(id, update, { new: true });
//     if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
//     res.status(200).json({ success: true, data: delivery });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to update delivery", error: err.message });
//   }
// };

// exports.getDeliveryByOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const delivery = await Delivery.findOne({ orderId });
//     if (!delivery) return res.status(404).json({ success: false, message: "Delivery not found" });
//     res.status(200).json({ success: true, data: delivery });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to fetch delivery", error: err.message });
//   }
// }; 

// const Delivery = require("../models/deliveryModel");

// Create Delivery
exports.createDelivery = async (req, res) => {
  try {
    const {
      userId,
      orderId,
      deliveryStatus = "Pending",
      estimatedDeliveryDate,
      actualDeliveryDate,
      priority = "normal",
      customerContact,
      customerPhone,
      deliveryAddress
    } = req.body;

    const deliveryData = {
      userId,
      orderId,
      deliveryStatus,
      estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
      actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : null,
      priority,
      customerContact,
      customerPhone,
      deliveryAddress,
      statusHistory: [{
        status: deliveryStatus,
        timestamp: new Date(),
        notes: "Delivery created",
        updatedBy: req.user?.fullname || "system"
      }]
    };

    const delivery = new Delivery(deliveryData);
    await delivery.save();

    // === AUTOMATIC ORDER STATUS UPDATE ON DELIVERY CREATION ===
    if (delivery && delivery.orderId) {
      let newOrderStatus;
      if (delivery.deliveryStatus === "Delivered") newOrderStatus = "Delivered";
      else if (delivery.deliveryStatus === "Out for Delivery") newOrderStatus = "Shipped";
      else if (delivery.deliveryStatus === "Failed") newOrderStatus = "Cancelled";
      else if (delivery.deliveryStatus === "Pending") newOrderStatus = "Processing"; // or "Pending" if you prefer

      if (newOrderStatus) {
        await Order.findByIdAndUpdate(
          delivery.orderId,
          { orderStatus: newOrderStatus }
        );
      }
    }
    // === END ORDER STATUS UPDATE ===

    const populatedDelivery = await Delivery.findById(delivery._id)
      .populate('orderId', 'orderNumber totalAmount items customerName')
      .populate('userId', 'fullname email phoneNumber');

    res.status(201).json({ 
      success: true, 
      message: "Delivery created successfully",
      data: populatedDelivery 
    });
  } catch (err) {
    console.error("Create delivery error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create delivery", 
      error: err.message 
    });
  }
};
// exports.createDelivery = async (req, res) => {
//   try {
//     const {
//       userId,
//       orderId,
//       deliveryStatus = "Pending",
//       estimatedDeliveryDate,
//       actualDeliveryDate,
//       priority = "normal",
//       customerContact,
//       customerPhone,
//       deliveryAddress
//     } = req.body;

//     const deliveryData = {
//       userId,
//       orderId,
//       deliveryStatus,
//       estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
//       actualDeliveryDate: actualDeliveryDate ? new Date(actualDeliveryDate) : null,
//       priority,
//       customerContact,
//       customerPhone,
//       deliveryAddress,
//       statusHistory: [{
//         status: deliveryStatus,
//         timestamp: new Date(),
//         notes: "Delivery created",
//         updatedBy: req.user?.fullname || "system"
//       }]
//     };

//     const delivery = new Delivery(deliveryData);
//     await delivery.save();

//     const populatedDelivery = await Delivery.findById(delivery._id)
//       .populate('orderId', 'orderNumber totalAmount items customerName')
//       .populate('userId', 'fullname email phoneNumber');

//     res.status(201).json({ 
//       success: true, 
//       message: "Delivery created successfully",
//       data: populatedDelivery 
//     });
//   } catch (err) {
//     console.error("Create delivery error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to create delivery", 
//       error: err.message 
//     });
//   }
// };

// Update Delivery Status
// exports.updateDeliveryStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       deliveryStatus, 
//       actualDeliveryDate
//     } = req.body;

//     const update = { 
//       deliveryStatus, 
//       actualDeliveryDate
//     };

//     if (deliveryStatus === "Delivered") {
//       update.deliveredAt = new Date();
//     }

//     const currentDelivery = await Delivery.findById(id);
//     if (!currentDelivery) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Delivery not found" 
//       });
//     }

//     const statusHistoryEntry = {
//       status: currentDelivery.deliveryStatus,
//       timestamp: new Date(),
//       notes: `Status updated to ${deliveryStatus}`,
//       updatedBy: req.user?.fullname || "system"
//     };

//     update.statusHistory = [...currentDelivery.statusHistory, statusHistoryEntry];

//     const delivery = await Delivery.findByIdAndUpdate(id, update, { new: true })
//       .populate('orderId', 'orderNumber totalAmount items customerName')
//       .populate('userId', 'fullname email phoneNumber');

//     res.status(200).json({ 
//       success: true, 
//       message: "Delivery status updated successfully",
//       data: delivery 
//     });
//   } catch (err) {
//     console.error("Update delivery error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to update delivery", 
//       error: err.message 
//     });
//   }
// };


exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus, actualDeliveryDate } = req.body;

    const update = { 
      deliveryStatus, 
      actualDeliveryDate
    };

    if (deliveryStatus === "Delivered") {
      update.deliveredAt = new Date();
    }

    const currentDelivery = await Delivery.findById(id);
    if (!currentDelivery) {
      return res.status(404).json({ 
        success: false, 
        message: "Delivery not found" 
      });
    }

    const statusHistoryEntry = {
      status: currentDelivery.deliveryStatus,
      timestamp: new Date(),
      notes: `Status updated to ${deliveryStatus}`,
      updatedBy: req.user?.fullname || "system"
    };

    update.statusHistory = [...currentDelivery.statusHistory, statusHistoryEntry];

    // Update the delivery
    const delivery = await Delivery.findByIdAndUpdate(id, update, { new: true })
      .populate('orderId', 'orderNumber totalAmount items customerName orderStatus')
      .populate('userId', 'fullname email phoneNumber');

    // === AUTOMATIC ORDER STATUS UPDATE ===
    if (delivery && delivery.orderId) {
      let newOrderStatus = undefined;
      if (deliveryStatus === "Delivered") newOrderStatus = "Delivered";
      else if (deliveryStatus === "Out for Delivery") newOrderStatus = "Shipped";
      else if (deliveryStatus === "Failed") newOrderStatus = "Cancelled";
      else if (deliveryStatus === "Pending") newOrderStatus = "Processing"; // or "Pending" if you prefer

      if (newOrderStatus) {
        await Order.findByIdAndUpdate(
          delivery.orderId._id || delivery.orderId, // handle both populated and unpopulated
          { orderStatus: newOrderStatus }
        );
      }
    }
    // === END ORDER STATUS UPDATE ===

    res.status(200).json({ 
      success: true, 
      message: "Delivery status updated successfully",
      data: delivery 
    });
  } catch (err) {
    console.error("Update delivery error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update delivery", 
      error: err.message 
    });
  }
};

// Get All Deliveries
// exports.getAllDeliveries = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, priority } = req.query;
//     const filter = { isDeleted: { $ne: true } };
//     if (status) filter.deliveryStatus = status;
//     if (priority) filter.priority = priority;

//     const deliveries = await Delivery.find(filter)
//       .populate('orderId', 'orderNumber totalAmount items customerName')
//       .populate('userId', 'fullname email phoneNumber')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Delivery.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       data: deliveries,
//       pagination: {
//         totalPages: Math.ceil(total / limit),
//         currentPage: parseInt(page),
//         totalItems: total,
//         itemsPerPage: parseInt(limit)
//       }
//     });
//   } catch (err) {
//     console.error("Get all deliveries error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to fetch deliveries", 
//       error: err.message 
//     });
//   }
// };

exports.getAllDeliveries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const filter = { isDeleted: { $ne: true } };
    if (status) filter.deliveryStatus = status;
    if (priority) filter.priority = priority;

    const deliveries = await Delivery.find(filter)
      .populate('orderId', 'orderNumber totalAmount items customerName orderStatus status createdAt')
      .populate('userId', 'fullname email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Delivery.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: deliveries,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Get all deliveries error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch deliveries", 
      error: err.message 
    });
  }
};

// Delete Delivery (soft delete)
// exports.deleteDelivery = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const delivery = await Delivery.findByIdAndUpdate(
//       id, 
//       { isDeleted: true }, 
//       { new: true }
//     );
//     if (!delivery) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Delivery not found" 
//       });
//     }
//     res.status(200).json({ 
//       success: true, 
//       message: "Delivery deleted successfully" 
//     });
//   } catch (err) {
//     console.error("Delete delivery error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to delete delivery", 
//       error: err.message 
//     });
//   }
// };

exports.deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    
    // console.log("🔍 DEBUG: Attempting to hard delete delivery with ID:", id);
    
    // First check if delivery exists
    const existingDelivery = await Delivery.findById(id);
    if (!existingDelivery) {
      console.log("🔍 DEBUG: Delivery not found with ID:", id);
      return res.status(404).json({ 
        success: false, 
        message: "Delivery not found" 
      });
    }
    
    // console.log("🔍 DEBUG: Found delivery to delete:", existingDelivery._id);
    
    // Perform hard delete - completely remove from database
    const deletedDelivery = await Delivery.findByIdAndDelete(id);
    
    // console.log("🔍 DEBUG: Delivery hard deleted successfully:", deletedDelivery._id);
    
    res.status(200).json({ 
      success: true, 
      message: "Delivery deleted successfully",
      data: {
        id: deletedDelivery._id,
        deletedAt: new Date()
      }
    });
    
  } catch (err) {
    console.error("🔍 DEBUG: Delete delivery error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete delivery", 
      error: err.message 
    });
  }
};