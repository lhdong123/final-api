const express = require("express")
const router = express.Router()

const classesController = require("./classesController")

router.get("/teachers-of-class/:id", classesController.getListOfTeachers)

router.get("/students-of-class/:id", classesController.getListOfStudents)

router.get("/class-list", classesController.getClassList)

router.get("/:id/member-details/:id", classesController.getMemberDetails)

router.get("/:id", classesController.getClass)

/* GET classes listing. */

router.post("/", classesController.createClass)

module.exports = router
