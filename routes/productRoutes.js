const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();
const upload = require("../middlewares/fileUpload");

// Create product (upload multiple images)
router.post("/", upload.array("image", 10), productController.createProduct);

// Get all products
router.get("/", productController.getAllProduct);

// Get product by ID
router.get("/:id", productController.getProductById);

// Update product (optionally upload new images)
router.put("/:id", upload.array("image", 10), productController.updateProduct);

// Delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;


// const express = require("express");
// const productController = require("../controllers/productController");
// const router = express.Router();
// const upload = require("../middlewares/fileUpload");
// const multer = require("multer"); // Import multer to access MulterError

// // --- Debugging Middleware (Optional, for general request logging) ---
// router.use((req, res, next) => {
//   console.log(`[DEBUG] Incoming Request: ${req.method} ${req.originalUrl}`);
//   // You can also log headers, body (if parsed by a preceding middleware), etc.
//   // console.log('[DEBUG] Request Headers:', req.headers);
//   next();
// });

// // --- Multer Error Handling Middleware ---
// // This middleware should be placed AFTER Multer middleware functions in the routes
// // but BEFORE your regular route handlers to catch Multer-specific errors.
// router.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     console.error(`[ERROR] Multer Error: ${err.code} - ${err.message}`);
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(413).json({
//         success: false,
//         message: 'File too large. Maximum file size is 5 MB.',
//         errorCode: 'FILE_SIZE_LIMIT_EXCEEDED'
//       });
//     }
//     if (err.code === 'LIMIT_FILE_COUNT') {
//       return res.status(413).json({
//         success: false,
//         message: `Too many files. Maximum ${err.field} files allowed.`,
//         errorCode: 'FILE_COUNT_LIMIT_EXCEEDED'
//       });
//     }
//     // Handle other Multer errors
//     return res.status(400).json({
//       success: false,
//       message: `File upload error: ${err.message}`,
//       errorCode: err.code
//     });
//   } else if (err) {
//     // Handle any other errors that might occur during processing
//     console.error(`[ERROR] General Error: ${err.message}`);
//     return res.status(500).json({
//       success: false,
//       message: 'An unexpected server error occurred.',
//       error: err.message
//     });
//   }
//   next(); // Pass to the next error handler or route
// });


// // Create product (upload multiple images)
// router.post(
//   "/",
//   (req, res, next) => {
//     console.log("[DEBUG] POST / - Before file upload middleware");
//     next();
//   },
//   upload.array("image", 10), // This is where Multer processes the upload
//   (req, res, next) => {
//     // This callback runs AFTER Multer has processed the files
//     console.log("[DEBUG] POST / - After file upload middleware");
//     if (req.files) {
//       console.log(`[DEBUG] Uploaded files count: ${req.files.length}`);
//       // console.log('[DEBUG] Uploaded files:', req.files); // Log file details
//     }
//     // Check for any file upload errors that Multer might have attached to req
//     // (though the dedicated Multer error handler above should catch most)
//     if (req.fileValidationError) {
//       console.error(`[ERROR] File validation error: ${req.fileValidationError}`);
//       return res.status(400).json({ success: false, message: req.fileValidationError });
//     }
//     next(); // Continue to productController.createProduct
//   },
//   async (req, res, next) => {
//     console.log("[DEBUG] Calling productController.createProduct");
//     try {
//       await productController.createProduct(req, res, next);
//     } catch (error) {
//       console.error("[ERROR] Error in createProduct controller:", error.message);
//       next(error); // Pass the error to the next error handling middleware
//     }
//   }
// );

// // Get all products
// router.get("/", async (req, res, next) => {
//   console.log("[DEBUG] GET / - Calling productController.getAllProduct");
//   try {
//     await productController.getAllProduct(req, res, next);
//   } catch (error) {
//     console.error("[ERROR] Error in getAllProduct controller:", error.message);
//     next(error);
//   }
// });

// // Get product by ID
// router.get("/:id", async (req, res, next) => {
//   console.log(`[DEBUG] GET /:id - ID: ${req.params.id} - Calling productController.getProductById`);
//   try {
//     await productController.getProductById(req, res, next);
//   } catch (error) {
//     console.error("[ERROR] Error in getProductById controller:", error.message);
//     next(error);
//   }
// });

// // Update product (optionally upload new images)
// router.put(
//   "/:id",
//   (req, res, next) => {
//     console.log(`[DEBUG] PUT /:id - ID: ${req.params.id} - Before file upload middleware`);
//     next();
//   },
//   upload.array("image", 10), // Multer processes the upload
//   (req, res, next) => {
//     // This callback runs AFTER Multer has processed the files
//     console.log(`[DEBUG] PUT /:id - ID: ${req.params.id} - After file upload middleware`);
//     if (req.files) {
//       console.log(`[DEBUG] Uploaded files count for update: ${req.files.length}`);
//       // console.log('[DEBUG] Uploaded files for update:', req.files); // Log file details
//     }
//     if (req.fileValidationError) {
//         console.error(`[ERROR] File validation error for update: ${req.fileValidationError}`);
//         return res.status(400).json({ success: false, message: req.fileValidationError });
//     }
//     next(); // Continue to productController.updateProduct
//   },
//   async (req, res, next) => {
//     console.log(`[DEBUG] Calling productController.updateProduct for ID: ${req.params.id}`);
//     try {
//       await productController.updateProduct(req, res, next);
//     } catch (error) {
//       console.error("[ERROR] Error in updateProduct controller:", error.message);
//       next(error);
//     }
//   }
// );

// // Delete product
// router.delete("/:id", async (req, res, next) => {
//   console.log(`[DEBUG] DELETE /:id - ID: ${req.params.id} - Calling productController.deleteProduct`);
//   try {
//     await productController.deleteProduct(req, res, next);
//   } catch (error) {
//     console.error("[ERROR] Error in deleteProduct controller:", error.message);
//     next(error);
//   }
// });

// module.exports = router;