const bcrypt = require("bcrypt")
//const emailValidator = require('email-deep-validator');
const { OAuth2Client } = require("google-auth-library")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken")
const { isBefore, addSeconds } = require("date-fns")

const userModel = require("./userModel")
const mongoose = require("mongoose")
const saltRounds = 10
const refreshTokenModel = require("./refreshTokenModel")

exports.hashPassword = async (password) => {
  const password_hash = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  return password_hash
}

exports.checkUserSignUp = async (data) => {
  // let check = {
  //   isFailEmail: false,
  //   valid: false,
  // }
  // Kiểm tra email cố tồn tại trong cơ sở dữ liệu không
  const emailExist = await userModel.findOne({ email: data.email })
  //const EmailValidator = new emailValidator();
  //let emailValid = await EmailValidator.verify(account.email);
  // console.log("EMAIL VALID");
  // //console.log(emailValid.validators.smtp.reason);
  // console.log(emailValid);

  // while(emailValid.validMailbox == null)
  // {
  //     emailValid = await EmailValidator.verify(account.email);
  // }

  // check.valid = emailValid.validMailbox;

  // console.log("KIEM TRA EMAIL TỒN TẠI KHÔNG");

  // console.log(emailExist);

  // console.log(check);
  // //console.log(valid);

  if (emailExist !== null) {
    return false
  }

  return true
}

exports.createNewUser = async (data) => {
  const userInfo = {
    username: data.username,
    password: data.password,
    email: data.email,
    isBlock: false
  }

  const newUser = new userModel(userInfo)

  await newUser.save()

  return newUser._id
}

exports.checkUserExist = async(email)=>{
  //console.log(email)
  const result = await userModel.findOne({email: email})
  //console.log(result);
  if(result)
  {
    if(!result.password)
    {
      return false;
    }
    else{
      return true;
    }
  }
  else{
    return false;
  }
}

exports.addSocialLoginUser = async (data) => {
  const newUser = new userModel(data)

  await newUser.save()

  return newUser._id
}

// passport needs to use these functions

exports.checkUser = async (username, password) => {
  const user = await userModel.findOne({ username: username })

  //console.log("check user")
  //console.log(user)
  if (!user) {
    return false
  }
  let checkPassword = await bcrypt.compare(password, user.password)
  if (checkPassword) {
    return user
  }

  return false
}

exports.getUser = async (id) => {
  return await userModel.findOne({ _id: id })
}

exports.updateStudentId = async (userId, studentId) => {
  const userInfo = await userModel.findOne({ _id: userId })

  if (!userInfo) {
    return {
      status: 409,
      error: "Precondition Failed",
    }
  }

  const result = await userModel.findOne({studentId: studentId})

  // Student Id has been used
  if (result) {
    return false
  } else {
    await userModel.findOneAndUpdate({ _id: userId }, { studentId: studentId })
  }

  const res = userModel.findById(userId)
  return res
}

/**
 * Decode id token to get user info
 * @param {string} token id token of Google
 * @returns user info
 */
exports.getDecodedOAuthJwtGoogle = async (token) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    return ticket
  } catch (error) {
    return { status: 500, data: error }
  }
}

exports.createRefreshToken = async (user) => {
  const refreshToken = uuidv4()

  let expiredAt = addSeconds(new Date(), process.env.REFRESH_TOKEN_EXPIRATION)

  // Save refreshToken to database
  await new refreshTokenModel({
    userId: user._id,
    username: user.username,
    refreshToken: refreshToken,
    expiryDate: expiredAt,
  }).save()

  return refreshToken
}

exports.getRefreshTokenInfo = async (refreshToken) => {
  const result = await refreshTokenModel.findOne({ refreshToken: refreshToken })
  return result
}

exports.verifyExpiration = (token) => {
  return isBefore(token.expiryDate, new Date())
}

exports.createAccessToken = (userId, username) => {
  const accessToken = jwt.sign(
    {
      _id: userId,
      username: username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  )

  return accessToken
}

exports.deleteRefreshToken = async (userId) => {
  await refreshTokenModel.deleteOne({ userId: userId })
}
