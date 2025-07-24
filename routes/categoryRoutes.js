const express = require("express")
const router = express.Router()
const categoryController = require("../controllers/categoryController")
const { isAdmin, authenticateUser } = require("../middlewares/authorizedUser")
// const upload = require("../middlewares/fileUpload")

router.post(
    "/",
    authenticateUser,
    isAdmin,
    // upload.single("image"),
    categoryController.createCategory
)

router.get(
    "/",
    categoryController.getAllCategories
)

router.get(
    "/:id",
    categoryController.getCategoryById
)

router.put(
    "/:id",
    authenticateUser,
    isAdmin,
    categoryController.updateCategory
)

router.delete(
    "/:id",
    authenticateUser, 
    isAdmin,
    categoryController.deleteCategory
)

module.exports = router