const Joi = require('@hapi/joi')
const name = require('./name')
const path = require('./path')
const joiErrors = require('./joiErrors')
const schema = Joi.object()
  .keys({
    name,
    path
  })
  .error(joiErrors)

module.exports = schema
