const Joi = require('@hapi/joi')

const name = /^[\w-.]+$/
const schema = Joi.string()
  .label('name')
  .trim()
  .replace(/\s/g, '-')
  .regex(name)
  .min(3)
  .max(20)
  .required()

module.exports = schema
