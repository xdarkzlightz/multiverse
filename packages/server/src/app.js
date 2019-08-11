const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-morgan')
const passport = require('koa-passport')
const join = require('path').join
const winston = require('./utils/winston')
const FriendlyError = require('./errors/FriendlyError')

const dockerRoutes = require('./routes/container-routes')
const userRoutes = require('./routes/user-routes')
const authRoutes = require('./routes/auth-routes')

const app = new Koa()
const env = process.env.NODE_ENV

app.use(bodyParser())
// Don't want to be logging endpoints if in a test environment
if (env !== 'test') app.use(logger('combined', { stream: winston.stream }))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof FriendlyError) {
      ctx.status = err.status
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    } else {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  }
})
require('./services/PassportService')
app.use(passport.initialize())

app.use(dockerRoutes.routes())
app.use(userRoutes.routes())
app.use(authRoutes.routes())
// Multiverse-Server can optionally serve a client using the GET / endpoint
app.use(require('koa-static')(join(__dirname, '/client')))

app.on('error', (err, ctx) => {
  if (err instanceof FriendlyError !== true) winston.error(err.stack)
})

module.exports = app
