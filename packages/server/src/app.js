const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-morgan')
const join = require('path').join
const dockerRoutes = require('./routes/container-routes')
const winston = require('./utils/winston')

const app = new Koa()
const env = process.env.NODE_ENV

app.use(bodyParser())
// Don't want to be logging endpoints if in a test environment
if (env !== 'test') app.use(logger('combined', { stream: winston.stream }))

app.use(dockerRoutes.routes())
// Multiverse-Server can optionally serve a client using the GET / endpoint
app.use(require('koa-static')(join(__dirname, '/client')))

app.on('error', (err, ctx) => {
  if (err.status !== 400) winston.error(err.stack)
})

module.exports = app
