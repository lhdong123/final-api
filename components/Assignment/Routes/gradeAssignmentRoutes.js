const express = require("express")
const gradeAssignmentController = require("../Controller/gradeAssignmentController")

const router = express.Router()

router.post("/getGradeAssignment", gradeAssignmentController.getGradeStruct)

router.post("/addAssignment", gradeAssignmentController.addAssignment)

router.post("/updateAssignment", gradeAssignmentController.updateAssignment)

router.post(
  "/updateIndexAssignment",
  gradeAssignmentController.updateIndexAssignment
)

router.post("/deleteAssignment", gradeAssignmentController.deleteAssignment)

router.post("/upload-assignment", gradeAssignmentController.uploadAssignment)

router.post("/upload-student-list", gradeAssignmentController.uploadStudentList)

router.get(
  "/real-student-list/:id",
  gradeAssignmentController.getRealStudentList
)

router.put("/update-grade", gradeAssignmentController.updateGrade)

router.get("/total-grade-column/:id", gradeAssignmentController.getTotalGradeColumn)

router.post("/getDataToExport", gradeAssignmentController.getDataExport)

router.get("/personal-grade-board/:id", gradeAssignmentController.getPersonalGradeBoard)

router.put("/mark-as-final/:id", gradeAssignmentController.upAssignmentStatus)

router.post("/updateGradeByReview", gradeAssignmentController.updateGradeByReview)

module.exports = router
