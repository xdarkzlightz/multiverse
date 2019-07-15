const Joi = require('@hapi/joi')
const port = require('./port')

const schema = Joi.array()
  .label('ports')
  .items(port)

module.exports = schema
