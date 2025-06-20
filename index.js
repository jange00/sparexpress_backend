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

// file upload
const path = require("path")

// Connect to DB
connectDB()

// Middlewares
app.use(express.json())
// Cors
app.use(cors(corsOptions))


app.use(formidable());
// implement routes here
app.use("/api/auth",userRoute)
app.use("/api/admin/users", adminUserRoute)
app.use("/api/products", productRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/shipping-address", shippingAddressRoutes)
app.use("/api/specifications", specificationRouter)
app.use("/api/subcategories", subCategoryRoutes)
app.use("/apt/wishlist", wishlistRoutes)
// file upload
app.use("/uploads", express.static(path.join(__dirname,"uploads")))


// Start server
const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running")
    }
)