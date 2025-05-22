const express = require("express")
const router = express.Router()

const {createUser,getUser, getOneUser,updateOneUser, deleteOneUser} = require("../../controllers/admin/userManagementController")
const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUser")



router.post(
    "/create",
    createUser
)

router.get(
    "/",
    authenticateUser,
    isAdmin,
    getUser
)

router.get(
    "/:id", // req.params.id
    getOneUser
)

router.put(
    "/:id", // req.params.id
    updateOneUser
)

router.delete(
    "/:id", // req.params.id
    deleteOneUser
)

module.exports = router
