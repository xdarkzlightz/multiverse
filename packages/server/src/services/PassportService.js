const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const UserService = require('./UserService')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcrypt')
const FriendlyError = require('../errors/FriendlyError')

const userService = new UserService()

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) => done(null, user))

passport.use(
  new LocalStrategy({ session: false }, async (username, password, done) => {
    try {
      const user = await userService.getUser(username)
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

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// The secret key will be provided by a config provider once authentication and accounts are finished
opts.secretOrKey = 'secureLater'

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await userService.getUserById(jwtPayload.id)
      done(null, user)
    } catch (e) {
      if (e instanceof FriendlyError) {
        return done(null, false)
      }
      done(e)
    }
  })
)
