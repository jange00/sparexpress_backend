const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router()
const upload = require("../middlewares/fileUpload")

router.post(
    "/register",
    upload.single("image"),
    userController.registerUser
)
router.post(
    "/login",
    userController.loginUser
)
router.get("/users", userController.getAllUsers);
router.delete("/user/:id", userController.deleteUser);
router.put("/user/:id", userController.updateUser);
module.exports = router