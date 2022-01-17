const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const cors = require("cors")

const db = require("./dal/db")
const passport = require("./components/User/passport")

const indexRouter = require("./routes/index")
const usersRouter = require("./components/User/userRouter")
const classesRouter = require("./components/classes/index")
const joinRouter = require("./components/JoinClass/JoinRouter")
const assignmentRouter = require("./components/Assignment/Routes/gradeAssignmentRoutes")
const reviewRouter = require("./components/Review/ReviewRouter")
const notificationRouter = require("./components/Notification/NotificationRouter")
const adminRouter = require("./Admin/adminRouter")
const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(passport.initialize())

db()

app.use("/", indexRouter)
app.use("/user", usersRouter)
app.use(
  "/classes",
  passport.authenticate("jwt", {
    session: false,
  }),
  classesRouter
)
app.use("/join", joinRouter)
app.use("/assignment",
  passport.authenticate("jwt", {
    session: false,
  }), 
  assignmentRouter
)

app.use("/review",reviewRouter);

app.use("/notification",notificationRouter);

app.use("/admin",adminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
