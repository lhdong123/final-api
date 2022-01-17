const mongoose = require("mongoose")

const classesSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, require: true },
  className: { type: String, require: true },
  section: { type: String },
  subject: { type: String },
  room: { type: String },
  createdDate: { type: Date, default: Date.now() },
  inviteCode: { type: String, require: true },
  code: {type: String}
})

const teachersOfClassSchema = mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, require: true },
  username: { type: String, require: true },
  email: { type: String, require: true },
})

const studentsOfClassSchema = mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, require: true },
  username: { type: String, require: true },
  email: { type: String, require: true },
})

const Classes = mongoose.model("classes", classesSchema, "classes")
const TeachersOfClass = mongoose.model(
  "teachersOfClass",
  teachersOfClassSchema,
  "teachersOfClass"
)
const StudentsOfClass = mongoose.model(
  "studentsOfClass",
  studentsOfClassSchema,
  "studentsOfClass"
)

module.exports = {
  Classes,
  TeachersOfClass,
  StudentsOfClass,
}
