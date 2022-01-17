const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
  classId: { type: String, require: true },
  studentId: { type: String },
  assignmentId: {type: String},
  title: {type: String},
  ID: {type: String},
  disableComment: {type: Boolean},
  explanationMessge: {type: String},
  expectationGrade: {type: Number},
  DateCreate: { type: Date},
  commentList: [
    {
      comment: { type: String },
      date: { type: Date},
      Name:  {type: String},
      commentUser: {type: String},
    },
  ],
})

module.exports = mongoose.model("reviews", reviewSchema)