const Joi = require('@hapi/joi')
const path = require('./path')
const schema = Joi.array().items(
  Joi.array()
    .items(path)
    .length(2)
)

module.exports = schema
