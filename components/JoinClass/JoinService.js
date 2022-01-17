const bcrypt = require('bcrypt');
const saltRounds = 10;
const classModel = require("../classes/classesModel")


exports.addStudent = async ({userInfo}) => {
    //console.log("userINFO")
    console.log(userInfo)
    const user = {
        classId: userInfo.classId,
        userId: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
      }
    const newStudent = new classModel.StudentsOfClass(user)

    await newStudent.save()
  
    //console.log("add student");

    return newStudent;
}

exports.addTeacher= async ({userInfo}) => {
    //console.log("userINFO")
    //console.log(userInfo)
    const user = {
        classId: userInfo.classId,
        userId: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
      }
    const newTeacher = new classModel.TeachersOfClass(user)

    await newTeacher.save()
  
    //console.log("add teacher");

    return newTeacher;
}

exports.findClassId = async(code)=>
{
  const classList = await classModel.Classes.find();
  let result = false;
  let classId = ""
  for(let classElement of classList)
  {
 
    //console.log(classElement._id)
    result = await bcrypt.compare(classElement._id.toString(), code)
    
    
    if(result)
    {
      console.log(classElement._id)
      classId = (classElement._id).toString();
    }
  }


  return classId;
}