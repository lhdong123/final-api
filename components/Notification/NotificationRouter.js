const express = require("express")
const router = express.Router()

const NotificationController = require("./NotificationController")

router.post("/request-grade", NotificationController.requestGradeHandler)

router.post("/getNotification", NotificationController.getNotification)

router.post("/mark-as-final", NotificationController.markFinalHanler)

router.post("/updateGradeByReview", NotificationController.updateGradeNotification)

router.post("/addCommentNotification", NotificationController.addCommentNotification)

module.exports = router