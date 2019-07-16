const Joi = require('@hapi/joi')

const password = /^[\w@&%!#.\-^$]+$/

const schema = Joi.string()
  .label('password')
  .trim()
  .regex(password)
  .min(8)
  .max(30)

module.exports = schema
