
const express = require("express")
const handleChatQuery = require("../controllers/chatbotController")
const router = express.Router()

router.post(
    "/query" ,
    handleChatQuery
)
module.exports = router