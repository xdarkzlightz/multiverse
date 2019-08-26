const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-morgan')
const passport = require('koa-passport')
const mongoose = require('mongoose')
const join = require('path').join
const winston = require('./utils/winston')
const userService = require('./services/UserService')
const FriendlyError = require('./errors/FriendlyError')

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  ENV,
  PASSWORD
} = require('./config/config')

mongoose
  .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, {
    useNewUrlParser: true
  })
  .then(() =>
    winston.info(
      `Connected to db mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
    )
  )
  .catch(winston.error)

const app = new Koa()

app.use(bodyParser())
if (ENV !== 'test') app.use(logger('combined', { stream: winston.stream }))

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

app.use(require('./routes/container-routes').routes())
app.use(require('./routes/user-routes').routes())
app.use(require('./routes/auth-routes').routes())

// Multiverse-Server can optionally serve a client using the GET / endpoint
app.use(require('koa-static')(join(__dirname, '/client')))

app.on('error', err =>
  err instanceof FriendlyError !== true ? winston.error(err.stack) : null
)

module.exports = async () => {
  const admin = await userService.getUserByUsername('admin')
  if (!admin) {
    await userService.createUser({
      username: 'admin',
      password: PASSWORD,
      admin: true
    })
  }

  return app
}
