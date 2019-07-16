const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const logger = require('morgan')
const winston = require('./utils/winston')
const path = require('path')

const docker = require('./routes/docker')
const serverErrorHandler = require('./middlewares/serverErrorHandler')

const app = express()
app.use(logger('combined', { stream: winston.stream }))
app.use(bodyParser.json())
// Currently using basic authentication, one of the upcoming features is better authentication with passport & JWT
app.use(
  basicAuth({
    users: { admin: process.env.PASSWORD || 'password' },
    challenge: true
  })
)
// The / endpoint serves the client, this might change later as the project progresses
app.use(express.static(path.join(__dirname, 'client')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'))
})

app.use('/api/v0/docker', docker)
app.use(serverErrorHandler)

module.exports = app
