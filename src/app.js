const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')
const path = require('path')

const docker = require('./routes/docker')

const app = express()
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

app.use('/docker', docker)

module.exports = app
