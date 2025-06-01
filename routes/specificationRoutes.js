const express = require("express")
const router = express.Router()
const specificationController = require("../controllers/specificationController")

router.post(
    "/",
    specificationController.createSpecification
)

router.get(
    "/",
    specificationController.getAllSpecification
)

router.get(
    "/:id",
    specificationController.getSpecificationById
)

router.put(
    "/:id",
    specificationController.updateSpecification
)

router.delete(
    "/:id",
    specificationController.deleteSpecification
)

module.exports = router