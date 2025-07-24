const express = require("express")
const router = express.Router()
const brandController = require("../controllers/brandController")
const { authenticateUser, isAdmin } = require("../middlewares/authorizedUser")

router.post(
    "/",
    authenticateUser,
    isAdmin,
    brandController.createBrand
)

router.get(
    "/",
    brandController.getAllBrands
)

router.get(
    "/:id",
    brandController.getBrandById
)

router.put(
    "/:id",
    authenticateUser,
    isAdmin,
    brandController.updateBrand
)

router.delete(
    "/:id",
    authenticateUser,
    isAdmin,
    brandController.deleteBrand
)

module.exports = router