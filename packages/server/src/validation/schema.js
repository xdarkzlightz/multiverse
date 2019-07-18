const Joi = require('@hapi/joi')
const name = require('./name')
const path = require('./path')
const volumes = require('./volumes')
const joiErrors = require('./joiErrors')
const schema = Joi.object()
  .keys({
    name,
    path,
    volumes,
    http: Joi.boolean(),
    auth: Joi.boolean()
  })
  .error(joiErrors)

module.exports = schema
