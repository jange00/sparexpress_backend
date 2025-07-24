const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");
const { authenticateUser, isAdmin } = require("../middlewares/authorizedUser");

router.post("/", authenticateUser, isAdmin, subCategoryController.createSubCategory);
router.get("/", subCategoryController.getAllSubCategories);
router.get("/:id", subCategoryController.getSubCategoryById);
router.put("/:id", authenticateUser, isAdmin, subCategoryController.updateSubCategory);
router.delete("/:id", authenticateUser, isAdmin, subCategoryController.deleteSubCategory);

module.exports = router;
