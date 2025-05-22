require('dotenv').config()

const CONNECTION_STRING = process.env.MONGODB_URI

const express = require("express")
const connectDB = require("./config/db")
const app = express()

// Routes
const userRoute = require("./routes/userRoutes")
const adminUserRoute = require("./routes/admin/adminUserRoute")
const productRoute = require("./routes/product/productRoutes")

// Connect to DB
connectDB()

// Middlewares
app.use(express.json())

// implement routes here
app.use("/api/auth",userRoute)
app.use("/api/admin/user", adminUserRoute)
app.use("/api/products", productRoute)

// Start server
const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running")
    }
)