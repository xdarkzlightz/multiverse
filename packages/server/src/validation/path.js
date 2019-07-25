const Joi = require('@hapi/joi')

const schema = Joi.string()
  .label('path')
  .trim()
  .required()

module.exports = schema
