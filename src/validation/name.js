const Joi = require('@hapi/joi')

const name = /^[\w-.]+$/
const schema = Joi.string()
  .trim()
  .replace(/\s/g, '-')
  .regex(name)
  .min(3)
  .max(20)
  .required()

schema.errors(errs => {})

module.exports = schema
