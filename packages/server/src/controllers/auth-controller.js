const passport = require('koa-passport')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/config')
const logger = require('../utils/winston')

module.exports.login = async (ctx, next) => {
  return passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) logger.error(err)
      if (user) {
        const token = jwt.sign({ id: user.id }, SECRET)
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
