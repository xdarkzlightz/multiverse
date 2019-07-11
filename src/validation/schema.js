const Joi = require('@hapi/joi')
const name = require('./name')
const password = require('./password')
const port = require('./port')
const path = require('./path')
const volume = require('./volume')

const schema = Joi.object().keys({
  name,
  password,
  port: port.required(),
  path,
  auth: Joi.boolean().required(),
  http: Joi.boolean().required(),
  volumes: Joi.array()
    .items(volume)
    .required(),
  ports: Joi.array()
    .items(port)
    .required()
})

module.exports = schema
