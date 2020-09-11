const jwt = require('jsonwebtoken');
const passport = require("passport")
const fs = require('fs')

//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy
let privateKey = fs.readFileSync('./private.pem', 'utf8');
const SECRET = privateKey
//สร้าง Strategy
const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
}
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
      done(null, true)
})
//เสียบ Strategy เข้า Passport
passport.use(jwtAuth)
//ทำ Passport Middleware
module.exports = passport.authenticate("jwt", { session: false })