const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const app = express()
app.use(bodyParser.json())
app.use(
  basicAuth({
    users: { admin: process.env.PASSWORD || 'password' },
    challenge: true
  })
)

app.get('/', (req, res) => {
  res.send({
    message: 'Index endpoint, enpoint is for sending the frontend content'
  })
})

module.exports = app
