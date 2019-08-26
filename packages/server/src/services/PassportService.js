const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const userService = require('./UserService')
const JwtStrategy = require('passport-jwt').Strategy
const bcrypt = require('bcrypt')
const { SECRET } = require('../config/config')

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) => done(null, user))

passport.use(
  new LocalStrategy({ session: false }, async (username, password, done) => {
    try {
      const user = await userService.getUserByUsername(username)
      if (!user) {
        return done(null, false, { message: 'Invalid username' })
      }

      const match = await bcrypt.compare(password, user.password)

      if (match) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Invalid password' })
      }
    } catch (e) {
      return done(e)
    }
  })
)

const opts = {}

opts.jwtFromRequest = ctx => ctx.cookies.get('jwt')

opts.secretOrKey = SECRET

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await userService.getUserById(jwtPayload.id)
      done(null, user)
    } catch (e) {
      done(e)
    }
  })
)
