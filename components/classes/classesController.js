const mongoose = require("mongoose")
const classesService = require("./classesService")
const userService = require("../User/userService")
const userModel = require("../User/userModel")
const studentGradeService = require("../Assignment/Service/studentGradeService")
const gradeAssignMentService = require("../Assignment/Service/gradeAssignmentService")


exports.getClassList = async (req, res, next) => {
  const _id = req.user._id
  const result = await classesService.getClassList(_id)
  res.json(result)
}

exports.getClass = async (req, res, next) => {
  const result = await classesService.getClassInfo(req.params.id)
  res.json(result)
}

exports.createClass = async (req, res, next) => {
  const userId = req.user._id
  const data = { ...req.body, _id: userId }
  const newClass = await classesService.createNewClass(data)
  const userInfo = await userService.getUser(userId)
  await classesService.addTeacherToClass(
    newClass._id,
    userId,
    userInfo.username,
    userInfo.email
  )
  
  const code = await classesService.generateCode(newClass._id.toString())
  console.log(code);
  
  const updateData = {
    creator: mongoose.Types.ObjectId(userId),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: newClass._id.toString(),
    code: code
  }
  //console.log("modify")

  await classesService.classModify({ updateData })
  const newClassList = await classesService.getClassList(userId)

  res.json(newClassList)
}

exports.getListOfTeachers = async (req, res, next) => {
  const listOfTeachers = await classesService.getListOfTeachers(req.params.id)
  res.json(listOfTeachers)
}

exports.getListOfStudents = async (req, res, next) => {
  const listOfTeachers = await classesService.getListOfStudents(req.params.id)
  res.json(listOfTeachers)
}

exports.getMemberDetails = async (req, res, next) => {
  const userId = req.params.id
  const classId = req.url.split("/")[1]
  console.log(classId)

  if (!gradeAssignMentService.isValidObjectId(userId)) {
    res.status(404)
    res.send("Not found!")
    return
  }

  const result = await userModel.findById(userId)

  if (result) {
    if (result.studentId) {
      const fullName = await studentGradeService.getFullname(classId, result.studentId)

      res.json ({
        username: result.username,
        email: result.email,
        studentId: result.studentId,
        fullName: fullName
      })

      return
    }

    res.json ({
      username: result.username,
      email: result.email,
      studentId: "",
      fullName: ""
    })

  } else {
    res.status(404)
    res.send("Not found!")
  }
}