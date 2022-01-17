const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
  notificationId: { type: String, require: true },
  UserId: { type: String },
})

module.exports = mongoose.model("NotificationIdModels", reviewSchema)