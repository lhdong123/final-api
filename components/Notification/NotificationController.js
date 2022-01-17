const classModel = require("../classes/classesModel")
const notificationModel = require("./NotificationModel")
const notificationIdModel = require("./NotificationIdModel")
const userModel = require("../User/userModel")
const assignmentModel = require("../Assignment/Model/gradeAssignment")
const reviewModel = require("../Review/ReviewModel")
const saveNotificationModel = async (receiveUser, message, sendUser) => {
    let receiver = []
    for (let i of receiveUser) {
        console.log(typeof (i.userId))
        if (typeof (i.userId) !== String) {
            receiver.push(i.userId.toString())
        }
        receiver.push(i.userId)
    }
    //console.log(receiver);


    const notificationInfo = {
        sendUser: sendUser,
        receiveUser: receiver,
        Message: message,
    }
    const newNotification = new notificationModel(notificationInfo)

    await newNotification.save()

    return newNotification._id
}

const saveNotificationIdModel = async (receiveUser, NotificationId) => {
    //console.log(receiveUser)
    //console.log(NotificationId)
    const notificationInfo = {
        notificationId: NotificationId.toString(),
        UserId: receiveUser.toString(),
    }
    const newNotification = new notificationIdModel(notificationInfo)

    await newNotification.save()

}

exports.requestGradeHandler = async (req, res, next) => {
    const info = req.body;
    /**
     * classRoomId,
     * userId
     * title
     */
    console.log(info)
    const teacherList = await classModel.TeachersOfClass.find({ classId: info.classRoomId })
    // Lưu vào NotificationModel
    const message = `Request ${Title} grade review`
    let id = await saveNotificationModel(teacherList, message, info.userId)
    console.log("Đã lưu")
    for (let teacher of teacherList) {
        // Lưu vào NotificationIdModel
        await saveNotificationIdModel(teacher.userId, id)
        console.log("Đã lưu notificationId")
    }
    res.json(true);
}

exports.getNotification = async (req, res, next) => {
    console.log("getNotification")
    const userId = req.body.uesrId;

    // Tìm notificationId
    console.log(req.body)
    const notificationIdList = await notificationIdModel.find({ UserId: userId })
    console.log(notificationIdList)
    // Lấy các notification
    let notificationData = []
    for (let element of notificationIdList) {
        let notify = await notificationModel.findOne({
            _id: element.notificationId
        })

        notificationData.push(notify)
    }

    let nameList = [];
    for (let i of notificationData) {
        let name = await userModel.findOne({ _id: i.sendUser })
        nameList.push(name.username);
    }
    //console.log(nameList)
    res.json({
        data: notificationData,
        nameList: nameList
    });
}

exports.markFinalHanler = async (req, res, next) => {
    console.log("markFinalHanler")
    console.log(req.body)
    /**
     * assignmentId,
     * sendUser
     */

    const assignmentId = req.body.assignmentId;
    const sendUser = req.body.sendUser;

    // Tìm assignmetId để lấy gradeTitle và danh sách các studentId trong gradeList
    const data = await assignmentModel.GradeAssignment.findOne({ _id: assignmentId })
    const gradeList = data.gradeList;

    let receiveUser = []
    for (let i of gradeList) {
        receiveUser.push({
            userId: i.studentId
        })
    }
    console.log(data);

    // Lưu vào notificationModel
    //console.log("Lưu vào notificationModel")
    const message = `marked ${data.gradeTitle} grade as final`
    const id = await saveNotificationModel(receiveUser, message, sendUser)

    // Lưu vào notificationIdModel
    console.log("Lưu vào notificationIdModel")
    for (let i of receiveUser) {
        let userId = await userModel.findOne({ studentId: i.userId })
        if (userId) {
            await saveNotificationIdModel(userId._id, id)
        }
        else {
            await saveNotificationIdModel(i.userId, id)
        }

    }

    console.log("Đã lưu notificationidModel")


    res.json(true);
}

exports.updateGradeNotification = async (req, res, next) => {
    console.log("updateGradeNotification")
    console.log(req.body)
    const info = req.body;
    /**
     * reviewId: reviewId,
     * title: title,
     * user: user._id
     */

    // Lấy studentId từ reviewModel
    console.log("Lấy studentId")
    const data = await reviewModel.findOne({ _id: info.reviewId })
    const studentId = data.studentId;

    // Tạo message
    const message = `Updated your ${info.title} grade`;

    // Lưu vào notificationModel
    console.log("Lưu vào notificationModel")
    const id = await saveNotificationModel([{ userId: studentId }], message, info.user)

    // Lưu vào notificationIdModel
    await saveNotificationIdModel(studentId, id)

    res.json(true);
}

exports.addCommentNotification = async (req, res, next) => {
    console.log("addCommentNotification")
    console.log(req.body)
    const info = req.body;
    /**
     * reviewId: reviewId,
     * title: title,
     * user: user._id
     */

    // Lấy studentId từ reviewModel
    console.log("Lấy studentId")
    const data = await reviewModel.findOne({ _id: info.reviewId })
    const studentId = data.studentId;
    if (info.user !== studentId) {
        // Tạo message
        const message = `Replied you in request ${info.title} grade review`;

        // Lưu vào notificationModel
        console.log("Lưu vào notificationModel")
        const id = await saveNotificationModel([{ userId: studentId }], message, info.user)

        // Lưu vào notificationIdModel
        await saveNotificationIdModel(studentId, id)
    }

    res.json(true);
}