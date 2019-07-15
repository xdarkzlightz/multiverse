const Joi = require('@hapi/joi')

const id = /^[a-z0-9]*$/
const scheme = Joi.object({ id: Joi.string().regex(id) })
module.exports = scheme
