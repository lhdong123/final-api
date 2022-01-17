const bcrypt = require("bcrypt")
const saltRounds = 10

const mongoose = require("mongoose")
//const { compareDesc } = require("date-fns")
const compareDesc = require("date-fns/compareDesc")

const classesModel = require("./classesModel")

exports.getClassList = async (_id) => {
  let classes = []

  const classStudent = await classesModel.StudentsOfClass.find({ userId: _id })

  for (let i = 0; i < classStudent.length; i++) {
    const a = await classesModel.Classes.findById(classStudent[i].classId)

    if (a) {
      classes.push(a)
    }
  }

  const classTeacher = await classesModel.TeachersOfClass.find({ userId: _id })
  for (let i = 0; i < classTeacher.length; i++) {
    const a = await classesModel.Classes.findById(classTeacher[i].classId)

    if (a) {
      classes.push(a)
    }
  }

  classes.sort((a, b) => compareDesc(a.createdDate, b.createdDate))

  return classes
}

exports.getClassInfo = async (classId) => {
  return await classesModel.Classes.findById(classId)
}

exports.createNewClass = async (data) => {
  const classInfo = {
    creator: mongoose.Types.ObjectId(data._id),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: "invite-code",
    code : ""
  }
  const newClass = new classesModel.Classes(classInfo)

  await newClass.save()

  return newClass
}

exports.classModify = async ({ updateData }) => {
  //console.log("update")
  //console.log(updateData.inviteCode)
  // const a = await classesModel.findByIdAndUpdate(
  //   query,
  //   {
  //     className: updateData.className,
  //     section: updateData.section,
  //     subject: updateData.subject,
  //     room: updateData.room,
  //     inviteCode: updateData.inviteCode,
  //   }
  // )
  const a = await classesModel.Classes.findOneAndUpdate(
    { _id: updateData.inviteCode, className: updateData.className },
    {
      creator: updateData.creator,
      className: updateData.className,
      section: updateData.section,
      subject: updateData.subject,
      room: updateData.room,
      inviteCode: updateData.inviteCode,
      code: updateData.code
    }
  )

  //console.log(a)
}

exports.getListOfTeachers = async (classId) => {
  return await classesModel.TeachersOfClass.find({
    classId: mongoose.Types.ObjectId(classId),
  })
}

exports.getListOfStudents = async (classId) => {
  return await classesModel.StudentsOfClass.find({
    classId: mongoose.Types.ObjectId(classId),
  })
}

exports.addTeacherToClass = async (classId, userId, username, email) => {
  const teacherInfo = {
    classId: classId,
    userId: userId,
    username: username,
    email: email,
  }

  const newTeacher = classesModel.TeachersOfClass(teacherInfo)
  await newTeacher.save()
  //console.log("save new teacher")
}

exports.generateCode = async(id)=>
{
  const code = await new Promise((resolve, reject) => {
    bcrypt.hash(id, saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  return code;
}
