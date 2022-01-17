const mongoose = require("mongoose")

const gradeassignmentSchema = mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, require: true },
  userId: { type: mongoose.Schema.Types.ObjectId, require: true },
  gradeTitle: { type: String },
  gradeDetail: { type: String },
  disableState: { type: Boolean },
  indexAssignment: { type: Number },

  // realStudentList: [{ type: String }],W
  // grade: [{ type: String }],
  gradeList: [
    {
      studentId: { type: String },
      grade: { type: String },
    },
  ],
  isFinalized: {type: Boolean, require: true, default: false}
})

const uploadedStudentListSchema = mongoose.Schema({
  classId: { type: String, require: true },
  studentIdList: [{ type: String }],
  fullnameList: [{ type: String }],
})

const GradeAssignment = mongoose.model(
  "gradeassignments",
  gradeassignmentSchema,
  "gradeassignments"
)
const UploadedStudentList = mongoose.model(
  "uploadedStudentList",
  uploadedStudentListSchema,
  "uploadedStudentList"
)

module.exports = {
  GradeAssignment,
  UploadedStudentList,
}
