const Joi = require('@hapi/joi')

const schema = Joi.array()
  .label('port')
  .required()
  .items(Joi.number().port())
  .length(2)

module.exports = schema
