const bcrypt = require("bcrypt")
const saltRounds = 10
const adminModel = require("./adminModel")
const userModel = require("../User/userModel")
const classModel = require("../classes/classesModel")
const gradeModel = require("../Assignment/Model/gradeAssignment")
exports.isExistInData = async (userInfo) => {
    // Lấy danh sách admin
    const adminList = await adminModel.find();

    // So sánh các admin trong ds với userInfo
    let result = false;
    let isAdmin = null;
    for (let admin of adminList) {
        if (admin.username === userInfo.username) {
            result = await bcrypt.compare(userInfo.password, admin.password)
            if (result) {
                isAdmin = admin
            }
        }
    }

    return isAdmin;
}

exports.getAdminData = async (userInfo) => {
    // Lấy danh sách admin
    const adminList = await adminModel.find();


    return adminList;
}

exports.getUserData = async (userInfo) => {
    // Lấy danh sách user
    const userList = await userModel.find();


    return userList;
}

exports.getClassData = async (userInfo) => {
    // Lấy danh sách lớp
    const classList = await classModel.Classes.find();

    return classList;
}

exports.blockHandler = async (userInfo) => {
    const isBlock = !userInfo.isBlock;

    // Update user
    const user = await userModel.findOneAndUpdate({ _id: userInfo._id },
        {
            isBlock: isBlock
        }
    )
    //console.log(user)

    return true;
}

exports.createAdminAccount = async (userInfo) => {
    //  Kiểm tra đã tồn tại trong admin data chưa
    const isExist = await adminModel.findOne({ email: userInfo.email });

    if (isExist) {
        return false;
    }
    else {
        const password = await new Promise((resolve, reject) => {
            bcrypt.hash(userInfo.password, saltRounds, function (err, hash) {
                if (err) reject(err)
                resolve(hash)
            })
        })
        const adminInfo = {
            username: userInfo.username,
            password: password,
            email: userInfo.email,
            dateCreate: new Date()
        }

        const newAdmin = new adminModel(adminInfo)

        await newAdmin.save()

        return newAdmin;
    }
}

exports.getAdminDetailAccount = async (_id) => {
    const result = await adminModel.findOne({ _id: _id })
    console.log(result);
    return result;
}

exports.getUserDetailAccount = async (_id) => {
    console.log("getUserDetail")
    // Thông tin user
    const user = await userModel.findOne({ _id: _id })

    // Danh sách các lớp tham gia với vai trò Student
    const studentClassList = await classModel.StudentsOfClass.find({ userId: _id })
    let nameStudentClasslist = [];

    if (studentClassList.length !== 0) {
        for (let i of studentClassList) {
            let temp = await classModel.Classes.findOne({ _id: i.classId })
            if (temp !== null) {
                nameStudentClasslist.push(temp.className)
            }
        }
    }

    // Danh sách các lớp tham gia với vai trò Teacher
    const teacherClassList = await classModel.TeachersOfClass.find({ userId: _id })
    let nameTeacherClasslist = [];

    if (teacherClassList.length !== 0) {
        for (let i of teacherClassList) {
            console.log(i.classId)
            let temp = await classModel.Classes.findOne({ _id: i.classId })
            if (temp !== null) {
                nameTeacherClasslist.push(temp.className)
            }
        }
    }


    const result =
    {
        user: user,
        studentClassList: nameStudentClasslist,
        teacherClassList: nameTeacherClasslist
    }

    return result;
}

exports.getClassDetailAccount = async (_id) => {
    console.log("getClassDetailAccount")

    // Thông tin class
    const classInfo = await classModel.Classes.findOne({ _id: _id })

    // Danh sách Student tham gia lớp 
    const studentClassList = await classModel.StudentsOfClass.find({ classId: _id })
    let nameStudentClasslist = [];

    // Lấy tên của student
    if (studentClassList.length !== 0) {
        for (let i of studentClassList) {
            let temp = await userModel.findOne({ _id: i.userId })
            if (temp !== null) {
                nameStudentClasslist.push(temp.username)
            }
        }
    }

    // Danh sách Teacher tham gia lớp 
    const teacherClassList = await classModel.TeachersOfClass.find({ classId: _id })
    let nameTeacherClasslist = [];

    // Lấy tên của Teacher
    if (teacherClassList.length !== 0) {
        for (let i of teacherClassList) {
            let temp = await userModel.findOne({ _id: i.userId })
            if (temp !== null) {
                nameTeacherClasslist.push(temp.username)
            }
        }
    }

    // Lấy gradeStruct của lớp
    const grade = await gradeModel.GradeAssignment.find({ classId: _id })
    let gradeStruct = []
    if(grade !== null)
    {
        for(let i of grade)
        {
            gradeStruct.push(i);
        }
    }

    const result =
    {
        classInfo: classInfo,
        gradeStruct: gradeStruct,
        studentInfo: nameStudentClasslist,
        teacherInfo: nameTeacherClasslist
    }

    return result;
}