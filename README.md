# SpareXpress Backend API

A robust, production-ready RESTful API for an e-commerce platform specializing in automotive spare parts and accessories. Built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Product Management** - Complete CRUD operations for products with image upload support
- **Order Management** - Order creation, tracking, and status management
- **Shopping Cart** - Add, remove, and manage cart items
- **Wishlist** - Save and manage favorite products
- **Payment Integration** - Payment processing and management
- **Rating & Reviews** - Product rating and review system
- **Shipping Management** - Address management and delivery tracking
- **AI Chatbot** - Google Generative AI-powered customer support
- **Admin Panel** - Comprehensive admin interface for user and product management
- **File Upload** - Multi-image upload support for products
- **Email Integration** - Password reset and notification emails

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **AI Integration**: Google Generative AI
- **Testing**: Jest with Supertest
- **Security**: bcrypt for password hashing, CORS enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SpareXpress-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/spareXpress
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
SpareXpress Backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── admin/
│   │   └── userManagementController.js
│   ├── brandController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── chatbotController.js
│   ├── deliveryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── ratingsController.js
│   ├── shippingAddressController.js
│   ├── specificationController.js
│   ├── subCategoryController.js
│   ├── userController.js
│   └── wishlistController.js
├── middlewares/
│   ├── authorizedUser.js     # Authentication & authorization
│   └── fileUpload.js         # File upload configuration
├── models/
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── deliveryModel.js
│   ├── orderModel.js
│   ├── paymentModel.js
│   ├── productModel.js
│   ├── ratingsModel.js
│   ├── shipment_addressModel.js
│   ├── specification.js
│   ├── subCategoryModel.js
│   ├── userModel.js
│   └── wishlists.js
├── routes/
│   ├── admin/
│   │   └── adminUserRoute.js
│   ├── brandRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── chatbotRoutes.js
│   ├── deliveryRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   ├── ratingRoutes.js
│   ├── shippingAddressRoutes.js
│   ├── specificationRoutes.js
│   ├── subCategoryRoutes.js
│   ├── userRoutes.js
│   └── wishlistRoutes.js
├── tests/
│   ├── brand.test.js
│   ├── category.test.js
│   ├── subcategories.test.js
│   └── user.test.js
├── utils/
│   ├── api_error.js
│   └── api_respponse.js
├── uploads/                  # File upload directory
├── index.js                  # Main application file
├── server.js                 # Server entry point
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/getMe` | Get current user profile | Yes |
| GET | `/users` | Get all users | No |
| GET | `/users/:id` | Get user by ID | No |
| PUT | `/users/:id` | Update user | No |
| DELETE | `/users/:id` | Delete user | No |
| POST | `/request-reset` | Request password reset | No |
| POST | `/reset-password/:token` | Reset password | No |
| POST | `/change-password` | Change password | Yes |

### Admin User Management (`/api/admin/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create new user (Admin) | Yes (Admin) |
| GET | `/` | Get all users (Admin) | Yes (Admin) |
| GET | `/:id` | Get user by ID | No |
| PUT | `/:id` | Update user | No |
| DELETE | `/:id` | Delete user | No |

### Products (`/api/admin/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new product | Yes (Admin) |
| GET | `/` | Get all products | No |
| GET | `/:id` | Get product by ID | No |
| PUT | `/:id` | Update product | Yes (Admin) |
| DELETE | `/:id` | Delete product | Yes (Admin) |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new order | Yes |
| GET | `/` | Get all orders | No |
| GET | `/:id` | Get order by ID | No |
| GET | `/users/:userId` | Get orders by user ID | Yes |
| PUT | `/:id` | Update order | No |
| DELETE | `/:id` | Delete order | No |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Add item to cart | Yes |
| GET | `/user` | Get user's cart | Yes |
| PUT | `/item/:cartItemId` | Update cart item | No |
| DELETE | `/item/:cartItemId` | Remove item from cart | No |
| DELETE | `/clear/:userId` | Clear user's cart | No |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Add item to wishlist | No |
| GET | `/:userId` | Get user's wishlist | No |
| DELETE | `/:id` | Remove item from wishlist | No |

### Payments (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create payment | Yes |
| GET | `/` | Get all payments | Yes |
| GET | `/:id` | Get payment by ID | No |
| GET | `/users/:userId` | Get payments by user ID | Yes |
| PUT | `/:id` | Update payment | No |
| DELETE | `/:id` | Delete payment | No |

### Ratings (`/api/ratings`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create rating | No |
| GET | `/` | Get all ratings | No |
| GET | `/:id` | Get rating by ID | No |
| PUT | `/:id` | Update rating | No |
| DELETE | `/:id` | Delete rating | No |

### Shipping Address (`/api/shipping-address`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create shipping address | Yes |
| GET | `/` | Get all addresses | Yes |
| GET | `/users/:userId` | Get addresses by user ID | Yes |
| GET | `/users` | Get user's addresses | Yes |
| GET | `/:id` | Get address by ID | No |
| PUT | `/:id` | Update address | No |
| DELETE | `/:id` | Delete address | No |

### Brands (`/api/admin/brands`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create brand | Yes (Admin) |
| GET | `/` | Get all brands | No |
| GET | `/:id` | Get brand by ID | No |
| PUT | `/:id` | Update brand | Yes (Admin) |
| DELETE | `/:id` | Delete brand | Yes (Admin) |

### Categories (`/api/admin/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create category | Yes (Admin) |
| GET | `/` | Get all categories | No |
| GET | `/:id` | Get category by ID | No |
| PUT | `/:id` | Update category | Yes (Admin) |
| DELETE | `/:id` | Delete category | Yes (Admin) |

### Subcategories (`/api/admin/subcategories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create subcategory | Yes (Admin) |
| GET | `/` | Get all subcategories | No |
| GET | `/:id` | Get subcategory by ID | No |
| PUT | `/:id` | Update subcategory | Yes (Admin) |
| DELETE | `/:id` | Delete subcategory | Yes (Admin) |

### Specifications (`/api/specifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create specification | No |
| GET | `/` | Get all specifications | No |
| GET | `/:id` | Get specification by ID | No |
| PUT | `/:id` | Update specification | No |
| DELETE | `/:id` | Delete specification | No |

### Deliveries (`/api/deliveries`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create delivery | Yes (Admin) |
| GET | `/` | Get all deliveries | Yes (Admin) |
| PATCH | `/:id` | Update delivery status | Yes (Admin) |
| DELETE | `/:id` | Delete delivery | Yes (Admin) |

### Chatbot (`/api/chat-bot`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/query` | Send chat query to AI | No |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **User**: Regular customer with basic access
- **Admin**: Full administrative access to all endpoints

## 📁 File Upload

The API supports file uploads for:
- User profile pictures
- Product images (up to 10 images per product)
- Category images

Files are stored in the `uploads/` directory and served statically.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Production Considerations
- Use a production MongoDB instance (Atlas, etc.)
- Set up proper CORS configuration for your frontend domain
- Use environment-specific configurations
- Set up proper logging and monitoring
- Configure SSL/TLS certificates
- Set up backup strategies

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **SpareXpress Team**

## 🙏 Acknowledgments

- Express.js community
- MongoDB and Mongoose
- Google Generative AI
- All contributors and testers

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**SpareXpress Backend** - Powering the future of automotive e-commerce 🚗⚡ 