require("dotenv").config()
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connect successful")
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = connectDB
