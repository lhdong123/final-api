const userModel = require("../../User/userModel")
const gradeAssignmentService = require("../Service/gradeAssignmentService")
const studentGradeService = require("../Service/studentGradeService")

exports.getGradeStruct = async (req, res, next) => {
  //console.log("getGradeStruct")

  // Nhận classId
  //console.log(req.body)
  const classId = req.body.classId

  // Tìm gradeAssignment của classId
  const result = await gradeAssignmentService.getGradeStructAssignment(classId)
  //console.log(result)

  res.json(result)
}

exports.addAssignment = async (req, res, next) => {
  //console.log("addAssignment")

  // Dữ liệu truyền vào
  //console.log(req.body)
  const assignment = req.body

  // Thêm gradeTitle và gradeDetail vào database
  const result = await gradeAssignmentService.addAssignmentIntoStruct(
    assignment
  )

  res.json(result)
}

exports.updateAssignment = async (req, res, next) => {
  //console.log("addAssignment")

  // Dữ liệu truyền vào
  //console.log(req.body)
  const assignment = req.body

  // Thêm gradeTitle và gradeDetail vào database
  const result = await gradeAssignmentService.updateAssignmentIntoStruct(
    assignment
  )

  res.json(result)
}

exports.updateIndexAssignment = async (req, res, next) => {
  //console.log("updateIndexAssignment")

  // Dữ liệu truyền vào
  //console.log(req.body)
  const assignment = req.body

  // update indexAssignment khi drag và drop
  const result = await gradeAssignmentService.updateIndexAssignmentIntoStruct(
    assignment
  )

  res.json(result)
}

exports.deleteAssignment = async (req, res, next) => {
  //console.log("deleteAssignment")

  // Dữ liệu truyền vào
  //console.log(req.body)
  const assignment = req.body

  // Xóa assignment trong database theo _id
  const result = await gradeAssignmentService.deleteAssignmentStruct(assignment)

  res.json(result)
}

exports.uploadAssignment = async (req, res, next) => {
  //console.log("upload Assignment")

  // Dữ liệu truyền vào
  /**
   * data: Array
   * assignmentId: String
   * classId: string
   */
  //console.log("Data", req.body);
  const data = req.body.data
  const assignmentId = req.body.assignmentId
  const classId = req.body.classId

  //console.log(classId);
  const result = await gradeAssignmentService.uploadAssignmentCSV(
    data,
    assignmentId,
    classId
  )

  res.json(result)
}

exports.uploadStudentList = async (req, res, next) => {
  //console.log("upload studentlist")

  // Dữ liệu truyền vào
  /**
   * data: Array
   * classId: String
   */
  //console.log("Data", req.body)
  const data = req.body.data
  const classId = req.body.classId
  //console.log(typeof classId)

  let studentIdList = []
  let fullnameList = []
  // Remove title
  data.shift()
  // Mapping data
  data.forEach((element) => {
    studentIdList.push(element[0])
    fullnameList.push(element[1])
  })

  // Upload student list
  const result = await gradeAssignmentService.uploadStudentListCSV(
    studentIdList,
    fullnameList,
    classId
  )

  // Create gradeList template if gradeAssignment exist
  gradeAssignmentService.addGradeListTemplate(classId)

  res.json(result)
}

exports.getRealStudentList = async (req, res, next) => {
  const classId = req.params.id

  if (gradeAssignmentService.isValidObjectId(classId)) {
    const realStudentList = await gradeAssignmentService.getRealStudentList(
      classId
    )

    if (realStudentList) {
      res.json([realStudentList.studentIdList, realStudentList.fullnameList])
    } else res.json([])
  } else {
    res.status(404)
    res.send("Class not found to get real student list!")
  }
}

exports.updateGrade = async (req, res, next) => {
  const data = req.body
  const result = gradeAssignmentService.updateGrade(
    data.assignmentId,
    data.studentId,
    data.grade
  )
  res.json(result)
}

exports.getTotalGradeColumn = async (req, res, next) => {
  const classId = req.params.id

  const gradeStructAssignemnt =
    await gradeAssignmentService.getGradeStructAssignment(classId)

  const result = await gradeAssignmentService.calcTotalGradeColumn(
    gradeStructAssignemnt,
    classId
  )

  //console.log(result)
  res.json(result)
}

exports.getDataExport = async (req, res, next) => {
  /**
   * Nhận dữ liệu
   * classId: string
   * assignmentIdList: []
   */
  //console.log(req.body);

  const classId = req.body.classId
  const assignmentIdList = req.body.assignmentIdList

  // Xử lý map listStudent với assignment 
  const result = await gradeAssignmentService.createManageBoardData(classId, assignmentIdList);

  //console.log(result);

  res.json(result);
}

exports.getPersonalGradeBoard = async (req, res, next) => {
  const userId = req.user._id
  const classId = req.params.id

  const user = await userModel.findById(userId)

  const result = {
    haveStudentId: false,
    existsStudentIdInList: false,
    grades: []
  } 

  //  Kiem tra sinh vien da nhap studentId chua
  if (user?.studentId) {
    //const checkStudentInClass = await gradeAssignmentService.findStudent(classId, user.studentId)
    //console.log("--user", user)
    // Kiem tra studentId co trong danh sach lop hay khong
    const student = await studentGradeService.getStudentInUploadedStudentList(classId, user.studentId)

    if (student) {
      const grades = await studentGradeService.createPersonalGradeBoard(classId, user.studentId)
      const fullname = await studentGradeService.getFullname(classId, user.studentId)

      //console.log(grades, fullname) 
      result.haveStudentId = true
      result.existsStudentIdInList = true
      result.grades = grades
      res.json(result)
    } else {
      result.haveStudentId = true
      res.json(result)
    }
    
  } else {
    res.json(result)
  }
}

exports.upAssignmentStatus = async (req, res, next) => {
  const assignmentId = req.params.id
  const status = req.body.assignmentStatus
  const result = gradeAssignmentService.markAsFinal(assignmentId, status)
  res.json(result)
}

exports.updateGradeByReview = async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  const result = await gradeAssignmentService.updateGradeByReview(data)
  console.log(result)
  if(result)
  {
    res.json(true)
  }
  else{
    res.json(false)
  }
}
