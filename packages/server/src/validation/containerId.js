const Joi = require('@hapi/joi')
const joiErrors = require('./joiErrors')

const id = /^[a-z0-9]*$/
const scheme = Joi.object({ id: Joi.string().regex(id) }).error(joiErrors)
module.exports = scheme
