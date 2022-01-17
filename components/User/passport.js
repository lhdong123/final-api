const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy
const { ExtractJwt } = require("passport-jwt")
const JwtStrategy = require("passport-jwt").Strategy

const userService = require("./userService")

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const user = await userService.checkUser(username, password)
    //console.log("passport")
    //console.log(user)
    if (!user) {
      return done(null, false, {
        message: "Tên đăng nhập hoặc mật khẩu nhập sai!!!!",
      })
    }
    // if (user.accountState === 1) {
    //     return done(null, false, { message: 'Tài khoản của bạn đã bị khóa!!!!' });
    // }
    //console.log("da check")
    return done(null, user)
  })
)

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (id, done) {
  userService.getUser(id).then((user) => {
    done(null, user)
  })
})

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload)
    return done(null, { _id: jwt_payload._id, username: jwt_payload.username })
  })
)

module.exports = passport
