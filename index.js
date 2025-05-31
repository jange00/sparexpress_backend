require('dotenv').config()

const CONNECTION_STRING = process.env.MONGODB_URI

const express = require("express")
const connectDB = require("./config/db")
const app = express()

// Routes
const userRoute = require("./routes/userRoutes")
const adminUserRoute = require("./routes/admin/adminUserRoute")
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require('./routes/orderRoutes')
const brandRoutes = require("./routes/brandRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const ratingRouter = require("./routes/ratingRoutes")

// Connect to DB
connectDB()

// Middlewares
app.use(express.json())

// implement routes here
app.use("/api/auth",userRoute)
app.use("/api/admin/user", adminUserRoute)
app.use("/api/products", productRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/ratings", ratingRouter)

// Start server
const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running")
    }
)