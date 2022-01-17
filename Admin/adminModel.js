const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String },
  email: { type: String, require: true },
  dateCreate: {type: Date}
})

module.exports = mongoose.model("admins", adminSchema)