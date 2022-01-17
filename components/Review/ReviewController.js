const ReviewModel = require("./ReviewModel");
const reviewService = require("./ReviewService")
const classModel = require("../classes/classesModel");
const mongoose = require("mongoose")

exports.sendMessage = async (req, res, next) => {
    const info = req.body;

    const result = await reviewService.handleMessage(info)
    console.log(result);
    res.json(result);
}

exports.getReviews = async (req, res, next) => {
    const info = req.body;
    const result = await reviewService.getReviewsHandler(info)
    console.log(result);
    res.json(result);
}

exports.getReviewData = async (req, res, next) => {
    const info = req.body;
    console.log(info)
    const result = await ReviewModel.findOne({ _id: info.reviewId })
    //console.log(result)
    const className = await classModel.TeachersOfClass.find({ classId: result.classId })
    //console.log(className)
    let isTeacher = false;
    for(let i of className)
    {
        if((i.userId).toString() === info.userId)
        {
            isTeacher = true;
        }
    }
    //console.log((className.creator).toString())
    if (result.studentId !== info.userId && isTeacher === false) {
        res.status(404)
    }
    else if(result.studentId === info.userId)
    {
        res.json({
            data: result,
            disable: true
        });
    }
    else if(isTeacher)
    {
        res.json({
            data: result,
            disable: false
        });
    }

}

exports.addReviewComment = async (req, res, next) => {
    const info = req.body;
    console.log(info)
    const result = await reviewService.addCommentHandler(info)
    //console.log(result);
    res.json(result);
}

exports.closeComment= async (req, res, next) => {
    const info = req.body;
    console.log(info)
    const result = await reviewService.closeComment(info)
    res.json(result)
}
