// const mongoose = require("mongoose");

// const deliverySchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
//   deliveryStatus: { type: String, enum: ["Pending", "Out for Delivery", "Delivered", "Failed"], default: "Pending" },
//   deliveredAt: { type: Date },
//   deliveryAgent: { type: String }, // or ref to a User/Agent model
//   notes: { type: String },
//   proofOfDelivery: { type: String }, // e.g., image URL
// }, { timestamps: true });

// module.exports = mongoose.model("Delivery", deliverySchema); 

// const mongoose = require("mongoose");

// const deliverySchema = new mongoose.Schema({
//   // Core fields (you already have these)
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
//   deliveryStatus: { 
//     type: String, 
//     enum: ["Pending", "Out for Delivery", "Delivered", "Failed"], 
//     default: "Pending" 
//   },
//   deliveredAt: { type: Date },
//   // deliveryAgent: { type: String },
//   // notes: { type: String },
//   // proofOfDelivery: { type: String },

//   //  **Additional Essential Fields:**
  
//   // Delivery Details
//   estimatedDeliveryDate: { type: Date },
//   actualDeliveryDate: { type: Date },
//   priority: { 
//     type: String, 
//     enum: ["low", "normal", "high", "urgent"], 
//     default: "normal" 
//   },
  
//   // Customer Information
//   customerContact: { type: String },
//   customerPhone: { type: String },
//   deliveryAddress: { type: String },
  
//   // Delivery Instructions
//   // deliveryInstructions: { type: String },
//   // specialInstructions: { type: String },
  
//   // Package Information
//   packagingType: { 
//     type: String, 
//     enum: ["standard", "fragile", "temperature_controlled", "express"], 
//     default: "standard" 
//   },
  
//   // Service Options
//   // insuranceRequired: { type: Boolean, default: false },
//   // signatureRequired: { type: Boolean, default: true },
//   // fragileItems: { type: Boolean, default: false },
//   // temperatureControlled: { type: Boolean, default: false },
  
//   // Tracking & Analytics
//   trackingNumber: { type: String, unique: true, sparse: true },
//   deliveryAttempts: { type: Number, default: 0 },
//   lastAttemptDate: { type: Date },
  
//   // Cost & Pricing
//   deliveryCost: { type: Number, default: 0 },
//   insuranceCost: { type: Number, default: 0 },
//   totalCost: { type: Number, default: 0 },
  
//   // Location Tracking
//   pickupLocation: {
//     address: { type: String },
//     coordinates: {
//       lat: { type: Number },
//       lng: { type: Number }
//     }
//   },
//   deliveryLocation: {
//     address: { type: String },
//     coordinates: {
//       lat: { type: Number },
//       lng: { type: Number }
//     }
//   },
  
//   // Status History
//   statusHistory: [{
//     status: { type: String },
//     timestamp: { type: Date, default: Date.now },
//     notes: { type: String },
//     updatedBy: { type: String }
//   }],
  
//   // Issue Management
//   issues: [{
//     type: { type: String },
//     description: { type: String },
//     priority: { type: String },
//     status: { type: String, default: "open" },
//     createdAt: { type: Date, default: Date.now },
//     resolvedAt: { type: Date }
//   }],
  
//   // Performance Metrics
//   distance: { type: Number }, // in kilometers
//   deliveryTime: { type: Number }, // in minutes
//   customerRating: { type: Number, min: 1, max: 5 },
//   customerFeedback: { type: String },
  
//   // System Fields
//   isActive: { type: Boolean, default: true },
//   isDeleted: { type: Boolean, default: false },
  
// }, { 
//   timestamps: true,
//   // Add indexes for better performance
//   indexes: [
//     { orderId: 1 },
//     { userId: 1 },
//     { deliveryStatus: 1 },
//     { deliveryAgent: 1 },
//     { estimatedDeliveryDate: 1 },
//     { trackingNumber: 1 }
//   ]
// });

// //  **Pre-save middleware to generate tracking number**
// deliverySchema.pre('save', function(next) {
//   if (!this.trackingNumber) {
//     this.trackingNumber = 'DEL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
//   }
//   next();
// });

// //  **Method to update status with history**
// deliverySchema.methods.updateStatus = function(newStatus, notes, updatedBy) {
//   this.statusHistory.push({
//     status: this.deliveryStatus,
//     timestamp: new Date(),
//     notes: notes || '',
//     updatedBy: updatedBy || 'system'
//   });
//   this.deliveryStatus = newStatus;
//   return this.save();
// };

// //  **Method to add issue**
// deliverySchema.methods.addIssue = function(issueData) {
//   this.issues.push({
//     ...issueData,
//     createdAt: new Date()
//   });
//   return this.save();
// };

// // **Virtual for delivery duration**
// deliverySchema.virtual('deliveryDuration').get(function() {
//   if (this.deliveredAt && this.createdAt) {
//     return Math.round((this.deliveredAt - this.createdAt) / (1000 * 60)); // minutes
//   }
//   return null;
// });

// module.exports = mongoose.model("Delivery", deliverySchema);


const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  deliveryStatus: { 
    type: String, 
    enum: ["Pending", "Out for Delivery", "Delivered", "Failed"], 
    default: "Pending" 
  },
  deliveredAt: { type: Date },
  estimatedDeliveryDate: { type: Date },
  actualDeliveryDate: { type: Date },
  priority: { 
    type: String, 
    enum: ["low", "normal", "high", "urgent"], 
    default: "normal" 
  },
  customerContact: { type: String },
  customerPhone: { type: String },
  deliveryAddress: { type: String },
  trackingNumber: { type: String, unique: true, sparse: true },
  deliveryAttempts: { type: Number, default: 0 },
  lastAttemptDate: { type: Date },
  deliveryCost: { type: Number, default: 0 },
  insuranceCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  pickupLocation: {
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  deliveryLocation: {
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
    updatedBy: { type: String }
  }],
  issues: [{
    type: { type: String },
    description: { type: String },
    priority: { type: String },
    status: { type: String, default: "open" },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
  }],
  distance: { type: Number },
  deliveryTime: { type: Number },
  customerRating: { type: Number, min: 1, max: 5 },
  customerFeedback: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

deliverySchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    this.trackingNumber = 'DEL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Delivery", deliverySchema);