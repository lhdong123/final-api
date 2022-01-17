const express = require("express")
const router = express.Router()

const ReviewController = require("./ReviewController")

router.post("/sendMessage", ReviewController.sendMessage)

router.post("/getReviews", ReviewController.getReviews)

router.post("/getReviewData", ReviewController.getReviewData)

router.post("/addComment",ReviewController.addReviewComment)

router.post("/closeComment",ReviewController.closeComment)

module.exports = router