require("dotenv").config()
const joinService = require("./JoinService")
const classModel = require("../classes/classesModel")
const mailer = require("../User/mailer")
const mongoose = require("mongoose")

exports.addStudentHandler = async (req, res, next) => {
  //console.log(req.body);

  const userInfo = req.body
  let result = null

  //console.log(userInfo.classId)
  const checkStudentExistInData = await classModel.StudentsOfClass.findOne({
    classId: mongoose.Types.ObjectId(userInfo.classId),
    userId: userInfo._id,
  })

  const checkTeacherExistInData = await classModel.TeachersOfClass.findOne({
    classId: mongoose.Types.ObjectId(userInfo.classId),
    userId: userInfo._id,
  })

  //console.log(checkExistInData);

  if (checkStudentExistInData === null && checkTeacherExistInData === null) {
    result = await joinService.addStudent({ userInfo })
  } else if (checkStudentExistInData !== null) {
    //console.log("exist")
    result = checkStudentExistInData
  } else if (checkTeacherExistInData !== null) {
    //console.log("exist")
    result = checkTeacherExistInData
  }

  //console.log("new student");
  //console.log(result);

  res.json(result)
}

exports.addTeacherHandler = async (req, res, next) => {
  //console.log(req.body);

  const userInfo = req.body
  let result = null

  //console.log(userInfo.classId)
  const checkStudentExistInData = await classModel.StudentsOfClass.findOne({
    classId: mongoose.Types.ObjectId(userInfo.classId),
    userId: userInfo._id,
  })
  const checkTeacherExistInData = await classModel.TeachersOfClass.findOne({
    classId: mongoose.Types.ObjectId(userInfo.classId),
    userId: userInfo._id,
  })

  // console.log(checkExistInData);

  // if (checkExistInData === null) {
  //     result = await joinService.addTeacher({ userInfo });
  // }
  // else {
  //     console.log("exist")
  //     result = checkExistInData;
  // }
  if (checkStudentExistInData === null && checkTeacherExistInData === null) {
    result = await joinService.addTeacher({ userInfo })
  } else if (checkStudentExistInData !== null) {
    //console.log("exist")
    result = checkStudentExistInData
  } else if (checkTeacherExistInData !== null) {
    //console.log("exist")
    result = checkTeacherExistInData
  }

  //console.log("new teacher");
  //console.log(result);

  res.json(result)
}

exports.sendInviteHandler = async (req, res, next) => {
  const inviteLink =
    process.env.INVITATION_LINK + req.body.memberType + "/" + req.body.classId

  //console.log(req.body)

  //console.log(inviteLink)
  mailer.sendmailInvite(req.body.email, inviteLink)

  res.json(true)
}


exports.joinClassbyCode = async (req, res, next) => {
  //console.log(req.body);

  let userInfo = req.body
  /**
   * code: itemCode,
   * user: user
   */

  // Tìm classId có mã code trùng với userInfo.code
  const classId = await joinService.findClassId(userInfo.code);

  console.log(classId)

  let result = null

  //console.log(userInfo.classId)
  console.log("checkStudentExistInData")
  const checkStudentExistInData = await classModel.StudentsOfClass.findOne({
    classId: mongoose.Types.ObjectId(classId),
    userId: userInfo.user._id,
  })

  console.log("checkTeacherExistInData")
  const checkTeacherExistInData = await classModel.TeachersOfClass.findOne({
    classId: mongoose.Types.ObjectId(classId),
    userId: userInfo.user._id,
  })

  //console.log(checkExistInData);
  /**
   *  classId: userInfo.classId,
        userId: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
      }
   * 
   */
  userInfo = 
  {
    classId: classId,
    _id: userInfo.user._id,
    username:userInfo.user.username,
    email: userInfo.user.email
  }


  if (checkStudentExistInData === null && checkTeacherExistInData === null) {
    result = await joinService.addStudent({ userInfo })
  } else if (checkStudentExistInData !== null) {
    //console.log("exist")
    result = checkStudentExistInData
  } else if (checkTeacherExistInData !== null) {
    //console.log("exist")
    result = checkTeacherExistInData
  }

  //console.log("new student");
  //console.log(result);

  res.json(result)
}