const reviewModel = require("./ReviewModel")
const userModel = require("../User/userModel")

exports.handleMessage = async (info) => {
    console.log(info);
    let result = true;
    const user = await userModel.findOne({ _id: info.userId })
    const ID = user.studentId;
    const reviewInfo = {
        classId: info.classRoomId,
        studentId: info.userId,
        ID: ID,
        disableComment: false,
        title: info.title,
        explanationMessge: info.Message,
        expectationGrade: info.grade,
        assignmentId: info.assignmentId,
        DateCreate: info.Date,
        commentList: []
    }

    //Kiểm tra đã tồn tại 
    const isExist = await reviewModel.findOne({
        classId: info.classRoomId,
        studentId: info.userId,
        assignmentId: info.assignmentId,
        title: info.title
    })

    if (isExist) {
        //console.log(isExist)
        // let newcommentList = isExist.commentList;
        // newcommentList.push(reviewInfo.commentList[0])
        // await reviewModel.findOneAndUpdate(
        //     {
        //         classId: info.classRoomId,
        //         studentId: info.userId,
        //         title: info.title
        //     },
        //     {
        //         classId: info.classRoomId,
        //         studentId: info.userId,
        //         title: info.title,
        //         commentList: [
        //             {
        //                 comment: info.Message,
        //                 date: info.Date,
        //                 commentUser: info.userId
        //             }
        //         ]
        //     }
        // )
        const re = await reviewModel.findOneAndUpdate(
            {
                classId: info.classRoomId,
                studentId: info.userId,
                title: info.title,
            },
            {
                explanationMessge: info.Message,
                expectationGrade: info.grade,
                DateCreate: info.Date
            }
        )
        result = re._id;
    }
    else {
        const newReview = new reviewModel(reviewInfo)

        await newReview.save()

        result = newReview._id;
    }

    return result;
}

exports.getReviewsHandler = async (info) => {
    console.log(info);
    let result = []
    if (info.role === "member") {
        result = await reviewModel.find({ studentId: info.userId })
    }
    else {
        result = await reviewModel.find({ classId: info.classId })
    }

    return result;
}

exports.addCommentHandler = async (info) => {
    console.log(info);
    //Kiểm tra đã tồn tại 
    const isExist = await reviewModel.findOne({
        _id: info.reviewId
    })

    // Tìm tên trong user model
    const user = await userModel.findOne({_id: info.userId})

    if (isExist) {
        let newcommentList = isExist.commentList;
        newcommentList.push({
            comment: info.comment,
            date: new Date(),
            Name: user.username,
            commentUser: info.userId
        })
        await reviewModel.findOneAndUpdate(
            {
                _id: info.reviewId
            },
            {
                commentList: newcommentList
            }
        )
    }

    return true;
}

exports.closeComment = async (info) => {
   const result = await reviewModel.findOneAndUpdate(
        {
            _id: info.reviewId
        },
        {
            disableComment: info.disableComment
        }
    )

    return result;
}
