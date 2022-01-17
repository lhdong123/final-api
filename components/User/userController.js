const userService = require("./userService")
const mailer = require("./mailer")
const random = require("random")
const jwt = require("jsonwebtoken")

const userModel = require("./userModel")
const refreshTokenModel = require("./refreshTokenModel")

let store = require("store")

exports.signUpHandler = async (req, res, next) => {
  //console.log("post ")
  //let userId = null
  //console.log(req.body)
  const data = req.body
  const checkEmailValid = await userService.checkUserSignUp(data)
  console.log("checkEmailValid")
  //console.log(checkEmailValid)
  if (checkEmailValid) {
    const randomOTP = random.int((min = 100000), (max = 999999))
    //console.log(typeof data.email)

    //console.log(randomOTP)
    store.set(data.email, randomOTP)
    //console.log(store.get(data.email))
    mailer.sendmail(data.email, randomOTP)
  }
  res.json(checkEmailValid)
}

exports.forgotPassHandler = async (req, res, next) => {
  //console.log(req.body)
  const email = req.body.email;
  const result = await userService.checkUserExist(email);
  if (result) {
    const randomOTP = random.int((min = 100000), (max = 999999))
    store.set("ChangePasswordOTP", randomOTP)
    mailer.sendmail(email, randomOTP)
  }
  //console.log(result)
  res.json(result);
}

exports.confirmOTP = async (req, res, next) => {
  //console.log(typeof(req.body.ChangePasswordOTP))
  const data = req.body;
  let result = false;
  //console.log(store.get("ChangePasswordOTP"));
  if (parseInt(data.ChangePasswordOTP) === store.get("ChangePasswordOTP")) {
    result = true;
    //console.log("true");
  }

  return res.json(result);
}

exports.updatePassword = async (req, res, next) => {
  const data = req.body;
  console.log(data)
  const newpassword_hash = await userService.hashPassword(data.newpassword);
  await userModel.findOneAndUpdate({ email: data.email }, { password: newpassword_hash })

  return res.json(true);
}

exports.loginSocialHandler = async (req, res, next) => {
  const userInfo = await userService.getDecodedOAuthJwtGoogle(req.body.idToken)




  const emailExistInData = await userModel.findOne({ email: userInfo.payload.email })
  console.log(emailExistInData)
  if (emailExistInData && emailExistInData.password === undefined) {

    if (emailExistInData.isBlock === false) {
      const result = await refreshTokenModel.findOne({
        userId: emailExistInData._id,
      })
      const user = {
        _id: emailExistInData._id,
        username: emailExistInData.username,
      }
      let refreshToken = ""

      if (result) {
        refreshToken = result.refreshToken
      } else {
        refreshToken = await userService.createRefreshToken(user)
      }

      res.json({
        user: emailExistInData,
        idToken: jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        }),
        refreshToken: refreshToken,
      })
    }
    else {
      console.log("false login social")
      res.status(404)
      res.json(false)
    }

  } else if (emailExistInData === null) {
    const data = {
      email: userInfo.payload.email,
      username: userInfo.payload.name,
      studentId: "",
      isBlock: false
    }
    const newUser = await userService.addSocialLoginUser(data)
    const result = await refreshTokenModel.findOne({ userId: newUser._id })
    const userObj = {
      _id: newUser._id,
      username: newUser.username,
    }
    let refreshToken = ""

    if (result) {
      refreshToken = result.refreshToken
    } else {
      refreshToken = await userService.createRefreshToken(userObj)
    }
    res.json({
      user: newUser,
      idToken: jwt.sign(userObj, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
      refreshToken: refreshToken,
    })
  } else {
    res.json(false)
  }
}

exports.validEmailHandler = async (req, res, next) => {
  const data = req.body
  //console.log(data)
  //console.log(store.get(data.email))
  if (
    store.get(data.email) != undefined &&
    store.get(data.email) === parseInt(data.OTP)
  ) {
    data.password = await userService.hashPassword(data.password)
    await userService.createNewUser(data)
    return res.json(true)
  }

  return res.json(false)
}

exports.signInHandler = async (req, res, next) => {
  const result = await refreshTokenModel.findOne({ userId: req.user._id })
  const user = await userModel.findOne({ _id: req.user._id })
  let refreshToken = ""

  console.log(user)
  if (user && user.isBlock === false) {
    if (result) {
      refreshToken = result.refreshToken
    } else {
      refreshToken = await userService.createRefreshToken(req.user)
    }

    res.json({
      user: req.user,
      token: jwt.sign(
        {
          _id: req.user._id,
          username: req.user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        }
      ),
      refreshToken: refreshToken,
    })
  }
  else {
    res.status(404)
    res.json(false)
  }


}

exports.addStudentId = async (req, res, next) => {
  const userInfo = await userService.updateStudentId(
    req.user._id,
    req.body.studentId
  )

  if (userInfo) {
    res.json(userInfo)
  } else {
    res.status(409)
    res.json("Student Id has been used!")
  }
}

exports.getUserInfo = async (req, res, next) => {
  const userInfo = await userService.getUser(req.user._id)

  if (userInfo) {
    if (userInfo.password) delete userInfo.password
    res.json(userInfo)
  } else res.sendStatus(404)
}

exports.exchangeAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body
  const refreshTokenInfo = await userService.getRefreshTokenInfo(refreshToken)

  if (!refreshTokenInfo) {
    res.status(403).json({ message: "Refresh token is not in database!" })
    return
  }

  if (userService.verifyExpiration(refreshTokenInfo)) {
    await userService.deleteRefreshToken(refreshTokenInfo.userId)

    res.status(403).json({
      message: "Refresh token was expired. Please make a new signin request",
    })
    return
  }

  const user = await userModel.findOne({ _id: refreshTokenInfo.userId })

  const newAccessToken = userService.createAccessToken(user._id, user.username)

  res.status(200)
  res.json({
    //user: user,
    token: newAccessToken,
    //refreshToken: refreshToken,
  })
}
