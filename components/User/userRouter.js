const express = require("express")
const passport = require("./passport")

const router = express.Router()

const userController = require("./userController")

router.post("/sign-up", userController.signUpHandler)

router.post("/forgot-pass", userController.forgotPassHandler)

router.post("/confirm-OTP", userController.confirmOTP)

router.post("/update-password",userController.updatePassword)

router.post("/login-social", userController.loginSocialHandler)

router.post("/valid-email", userController.validEmailHandler)

router.post(
  "/sign-in",
  passport.authenticate("local", {
    session: false,
  }),
  userController.signInHandler
)

router.post(
  "/add-student-id",
  passport.authenticate("jwt", {
    session: false,
  }),
  userController.addStudentId
)

router.post("/exchange-access-token", userController.exchangeAccessToken)

//router.post("/revoke-token")

router.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  userController.getUserInfo
)

module.exports = router
