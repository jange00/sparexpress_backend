const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const upload = require("../middlewares/fileUpload");

router.post("/register", upload.single("profilePicture"), userController.registerUser);

router.post("/login", userController.loginUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", upload.single("profilePicture"),userController.updateUser);
module.exports = router;
