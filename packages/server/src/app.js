const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const logger = require('morgan')
const winston = require('./utils/winston')
const path = require('path')

const docker = require('./routes/docker')
const serverErrorHandler = require('./errorHandlers/serverError')

const app = express()
app.use(logger('combined', { stream: winston.stream }))
app.use(bodyParser.json())
app.use(
  basicAuth({
    users: { admin: process.env.PASSWORD || 'password' },
    challenge: true
  })
)
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

app.use('/api/v0/docker', docker)
app.use(serverErrorHandler)

module.exports = app
