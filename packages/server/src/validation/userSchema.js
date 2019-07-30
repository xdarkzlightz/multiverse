const Joi = require('@hapi/joi')
const username = require('./username')
const password = require('./password')
const joiErrors = require('./joiErrors')
const schema = Joi.object()
  .keys({
    username,
    password
  })
  .error(joiErrors)

module.exports = schema
