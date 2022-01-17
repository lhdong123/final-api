const express = require("express")
const passport = require("../components/User/passport")
const router = express.Router()

const adminController = require("./adminController")

router.post("/sign-in", adminController.signInHandler)

router.post("/getAdminData", adminController.getAdminData)

router.post("/getUserData", adminController.getUserData)

router.post("/getClassData", adminController.getClassData)

router.post("/blockUser", adminController.blockuser)

router.post("/createAdminAccount", adminController.createAdminAccount)

router.post("/getAdminDetailAccount", adminController.getAdminDetailAccount)

router.post("/getUserDetailAccount", adminController.getUserDetailAccount)

router.post("/getClassDetailAccount", adminController.getClassDetailAccount)

module.exports = router