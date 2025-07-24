const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const upload = require("../middlewares/fileUpload");
// const { authenticateUser, isAdmin} = require('../middlewares/authorizedUser')
const { authenticateUser, isAdmin } = require("../middlewares/authorizedUser");


router.post("/register", upload.single("profilePicture"), userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/getMe", authenticateUser, userController.getMe);

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", upload.single("profilePicture"),userController.updateUser);



// forgot password
router.post("/request-reset", userController.sendResetLink);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/change-password", authenticateUser, userController.changePassword);

module.exports = router;

