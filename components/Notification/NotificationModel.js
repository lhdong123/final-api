const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
  sendUser: { type: String, require: true },
  receiveUser: [{ type: String }],
  Message: {type: String}
})

module.exports = mongoose.model("NotificationModels", reviewSchema)