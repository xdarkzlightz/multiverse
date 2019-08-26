const Joi = require('@hapi/joi')

const name = /^[\w$-.^&#!%^]*$/
const schema = Joi.string()
  .label('password')
  .trim()
  .regex(name)
  .min(8)
  .max(30)
  .required()

module.exports = schema
