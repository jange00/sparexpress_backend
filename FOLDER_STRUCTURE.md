# SpareXpress Backend - Folder Structure

```
SpareXpress Backend/
├── 📁 config/
│   └── 📄 db.js                           # Database connection configuration
│
├── 📁 controllers/                        # Business logic layer
│   ├── 📁 admin/
│   │   └── 📄 userManagementController.js # Admin user management operations
│   ├── 📄 brandController.js              # Brand CRUD operations
│   ├── 📄 cartController.js               # Shopping cart operations
│   ├── 📄 categoryController.js           # Category CRUD operations
│   ├── 📄 chatbotController.js            # AI chatbot integration
│   ├── 📄 deliveryController.js           # Delivery management
│   ├── 📄 orderController.js              # Order processing and management
│   ├── 📄 paymentController.js            # Payment processing
│   ├── 📄 productController.js            # Product CRUD operations
│   ├── 📄 ratingsController.js            # Product ratings and reviews
│   ├── 📄 shippingAddressController.js    # Shipping address management
│   ├── 📄 specificationController.js      # Product specifications
│   ├── 📄 subCategoryController.js        # Subcategory CRUD operations
│   ├── 📄 userController.js               # User authentication and management
│   └── 📄 wishlistController.js           # Wishlist operations
│
├── 📁 middlewares/                        # Custom middleware functions
│   ├── 📄 authorizedUser.js               # JWT authentication & authorization
│   └── 📄 fileUpload.js                   # File upload configuration (Multer)
│
├── 📁 models/                             # MongoDB/Mongoose data models
│   ├── 📄 brandModel.js                   # Brand schema and model
│   ├── 📄 cartModel.js                    # Shopping cart schema
│   ├── 📄 categoryModel.js                # Category schema
│   ├── 📄 deliveryModel.js                # Delivery tracking schema
│   ├── 📄 orderModel.js                   # Order schema
│   ├── 📄 paymentModel.js                 # Payment schema
│   ├── 📄 productModel.js                 # Product schema
│   ├── 📄 ratingsModel.js                 # Rating and review schema
│   ├── 📄 shipment_addressModel.js        # Shipping address schema
│   ├── 📄 specification.js                # Product specification schema
│   ├── 📄 subCategoryModel.js             # Subcategory schema
│   ├── 📄 userModel.js                    # User schema
│   └── 📄 wishlists.js                    # Wishlist schema
│
├── 📁 routes/                             # API route definitions
│   ├── 📁 admin/
│   │   └── 📄 adminUserRoute.js           # Admin user management routes
│   ├── 📄 brandRoutes.js                  # Brand API endpoints
│   ├── 📄 cartRoutes.js                   # Cart API endpoints
│   ├── 📄 categoryRoutes.js               # Category API endpoints
│   ├── 📄 chatbotRoutes.js                # Chatbot API endpoints
│   ├── 📄 deliveryRoutes.js               # Delivery API endpoints
│   ├── 📄 orderRoutes.js                  # Order API endpoints
│   ├── 📄 paymentRoutes.js                # Payment API endpoints
│   ├── 📄 productRoutes.js                # Product API endpoints
│   ├── 📄 ratingRoutes.js                 # Rating API endpoints
│   ├── 📄 shippingAddressRoutes.js        # Shipping address API endpoints
│   ├── 📄 specificationRoutes.js          # Specification API endpoints
│   ├── 📄 subCategoryRoutes.js            # Subcategory API endpoints
│   ├── 📄 userRoutes.js                   # User authentication routes
│   └── 📄 wishlistRoutes.js               # Wishlist API endpoints
│
├── 📁 tests/                              # Test files
│   ├── 📄 brand.test.js                   # Brand controller tests
│   ├── 📄 category.test.js                # Category controller tests
│   ├── 📄 subcategories.test.js           # Subcategory controller tests
│   └── 📄 user.test.js                    # User controller tests
│
├── 📁 utils/                              # Utility functions
│   ├── 📄 api_error.js                    # Custom error handling
│   └── 📄 api_respponse.js                # Standardized API responses
│
├── 📁 uploads/                            # File upload storage directory
│   ├── 📁 products/                       # Product images
│   ├── 📁 profiles/                       # User profile pictures
│   └── 📁 categories/                     # Category images
│
├── 📄 .env                                # Environment variables (not in repo)
├── 📄 .gitignore                          # Git ignore rules
├── 📄 index.js                            # Main application setup and middleware
├── 📄 server.js                           # Server entry point
├── 📄 package.json                        # Project dependencies and scripts
├── 📄 package-lock.json                   # Dependency lock file
├── 📄 README.md                           # Project documentation
└── 📄 FOLDER_STRUCTURE.md                 # This file
```

## 📋 Directory Descriptions

### 🔧 **config/**
Contains configuration files for database connections and other external services.

### 🎮 **controllers/**
Contains the business logic for all API endpoints. Each controller handles specific domain operations.

### 🛡️ **middlewares/**
Custom middleware functions for authentication, authorization, and file uploads.

### 📊 **models/**
MongoDB/Mongoose schemas and models defining the data structure for all entities.

### 🛣️ **routes/**
API route definitions that map HTTP endpoints to controller functions.

### 🧪 **tests/**
Jest test files for testing controller functionality and API endpoints.

### 🛠️ **utils/**
Utility functions for error handling and standardized API responses.

### 📁 **uploads/**
Directory for storing uploaded files (images, documents, etc.).

## 🔗 Key Files

- **`index.js`**: Main application file with Express setup, middleware configuration, and route registration
- **`server.js`**: Server entry point that starts the application
- **`package.json`**: Project metadata, dependencies, and npm scripts
- **`.env`**: Environment variables (not committed to version control)

## 📊 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client/Frontend│    │   Express Server│    │   MongoDB       │
│                 │    │                 │    │                 │
│  HTTP Requests  │───▶│  Routes         │───▶│  Database       │
│                 │    │  Controllers    │    │  Collections    │
│  JSON Responses │◀───│  Middleware     │◀───│  Documents      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   File System   │
                       │   (uploads/)    │
                       └─────────────────┘
```

## 🎯 API Structure

The API follows RESTful conventions with the following base paths:

- `/api/auth` - Authentication endpoints
- `/api/admin/*` - Admin-only endpoints
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/cart` - Shopping cart
- `/api/payments` - Payment processing
- `/api/ratings` - Product reviews
- `/api/shipping-address` - Address management
- `/api/chat-bot` - AI chatbot
- And more...

Each endpoint follows standard HTTP methods (GET, POST, PUT, DELETE) and includes proper authentication where required. 