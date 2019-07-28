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
        // The secret key will be provided by a config provider once authentication and accounts are finished
        const token = jwt.sign({ id: user.id }, 'secureLater')
        if (user.firstLogin) {
          await userService.updateUser(user.id, { firstLogin: false })
        }
        ctx.status = 200
        ctx.body = { success: true, token }
      } else {
        ctx.body = { success: false }
        ctx.status = 401
      }
    }
  )(ctx)
}
