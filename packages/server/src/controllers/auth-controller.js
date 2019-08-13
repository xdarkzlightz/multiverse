const passport = require('koa-passport')
const jwt = require('jsonwebtoken')
const UserService = require('../services/UserService')

const userService = new UserService()
module.exports.login = async (ctx, next) => {
  return passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) console.log(err)
      if (user) {
        const secret = process.env.MULTIVERSE_JWT_SECRET
        const token = jwt.sign({ id: user.id }, secret)
        if (user.firstLogin) {
          await userService.updateUser(user.id, { firstLogin: false })
        }
        ctx.cookies.set('jwt', token, { maxAge: 1000 * 60 * 60 * 24 * 3 })
        ctx.status = 200
        ctx.body = { success: true, token, id: user.id }
      } else {
        ctx.body = { success: false }
        ctx.status = 401
      }
    }
  )(ctx)
}
