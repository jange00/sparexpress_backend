require('dotenv').config()
const formidable = require("express-formidable");

const CONNECTION_STRING = process.env.MONGODB_URI

const express = require("express")
const connectDB = require("./config/db")

const cors = require("cors")
let corsOptions = {
    origin: "*" // can provide list of domain
}
const app = express()

// Routes
const userRoute = require("./routes/userRoutes")
const adminUserRoute = require("./routes/admin/adminUserRoute")
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require('./routes/orderRoutes')
const brandRoutes = require("./routes/brandRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const ratingRoutes = require("./routes/ratingRoutes")
const shippingAddressRoutes = require("./routes/shippingAddressRoutes")
const specificationRouter = require("./routes/specificationRoutes")
const subCategoryRoutes = require("./routes/subCategoryRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const chatbotRoutes = require('./routes/chatbotRoutes')
const cartRoutes = require('./routes/cartRoutes')
// const esewaRoutes = require('./routes/esewaRoutes')

// file upload
const path = require("path")

// Connect to DB
connectDB()

// Middlewares
// app.use(express.json())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cors
app.use(cors(corsOptions))


// app.use(formidable());
// implement routes here
app.use("/api/auth",userRoute)
app.use("/api/admin/users", adminUserRoute)
app.use("/api/admin/products", productRoutes)
app.use("/api/admin/brands", brandRoutes)
app.use("/api/admin/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/shipping-address", shippingAddressRoutes)
app.use("/api/specifications", specificationRouter)
app.use("/api/admin/subcategories", subCategoryRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use('/api/chat-bot' ,chatbotRoutes)
app.use('/api/cart' ,cartRoutes)
// app.use("/api/esewa",esewaRoutes)
// file upload
app.use("/uploads", express.static(path.join(__dirname,"uploads")))


// Start server
// const PORT = process.env.PORT
// app.listen(
//     PORT,
//     () => {
//         console.log("Server running")
//     }
// )

module.exports = app;