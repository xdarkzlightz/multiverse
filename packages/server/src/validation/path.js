const Joi = require('@hapi/joi')

const path = /^\/([\w-+.]+\/?)*$/
const schema = Joi.string()
  .label('path')
  .trim()
  .regex(path)
  .required()

module.exports = schema
