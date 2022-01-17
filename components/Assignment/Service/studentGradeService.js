const gradeAssignmentService = require("./gradeAssignmentService")
const gradeAssignmentModel = require("../Model/gradeAssignment")

exports.getAssignmentGradeForStudent = async (classId, studentId) => {
  const res = await gradeAssignmentModel.GradeAssignment.findOne(
    {
      _id: assignmentId,
      "gradeList.studentId": studentId,
    },
    {
      $set: {
        "gradeList.$.grade": grade,
      },
    }
  )
}

/**
 * Create personal grade board for student who have the studenId
 * @param {String} classId 
 * @param {String} studentId 
 * @returns 
 */
exports.createPersonalGradeBoard = async (classId, studentId) => {
  const assignmentList = await gradeAssignmentService.getGradeStructAssignment(classId)
  //console.log("assignmentList", assignmentList[0].gradeList)
  if (assignmentList.length === 0) {
    return {
      gradeList: null,
      gradeBoard: null,
    }
  } else {
    let assignmentGradeTotal = 0
    let gradeTotal = 0
    let gradeList = []

    assignmentList.forEach((item) => {
      assignmentGradeTotal += parseFloat(item.gradeDetail)
    })

    assignmentList.forEach((item) => {
      const prescent = parseFloat(item.gradeDetail) / assignmentGradeTotal
      let grade = item.gradeList.find(e => e.studentId === studentId)?.grade

      if (typeof (grade) !== "string") {
        grade = ""
      }

      // "No result" if teacher don't mark a grade composition as finalized
      if (!item.isFinalized) {
        grade = "No result"
      }

      // Grade list to display in personal grade board
      gradeList.push({
        assignmentId: item._id,
        grade: grade
      })

      // Calculate total grade
      if (!isNaN(grade)){
        gradeTotal += parseFloat((grade * prescent).toFixed(2))
        gradeTotal = gradeTotal > 100 ? 100 : gradeTotal
      }
    })

    return {
      gradeList: gradeList,
      gradeTotal: gradeTotal
    }
  }
}

exports.getFullname = async (classId, studentId) => {
  const classInfo = await gradeAssignmentModel.UploadedStudentList.findOne({ classId: classId })

  if (classInfo) {
    const index = classInfo.studentIdList.findIndex(e => e === studentId)

    if (index >= 0) {
      return classInfo.fullnameList[index]
    }
  }
}

exports.getStudentInUploadedStudentList = async (classId, studentId) => {
  const student = await gradeAssignmentModel.UploadedStudentList.findOne({
    classId: classId,
    studentIdList: studentId,
  })

  return student
}