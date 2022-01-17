const mongoose = require("mongoose")

const refreshTokenSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, require: true },
  username: { type: String, require: true },
  refreshToken: { type: String, require: true },
  expiryDate: { type: Date, require: true },
})

module.exports = mongoose.model("refreshToken", refreshTokenSchema)
