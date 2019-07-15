const Joi = require('@hapi/joi')
const name = require('./name')
const password = require('./password')
const port = require('./port')
const path = require('./path')
const volumes = require('./volumes')
const ports = require('./ports.js')

const schema = Joi.object().keys({
  name,
  password,
  port,
  path,
  volumes,
  ports
})

module.exports = schema
