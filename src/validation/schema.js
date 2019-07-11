const Joi = require('@hapi/joi')
const name = require('./name')
const password = /^[\w@&%!#.\-^$]+$/
const path = /^\/([\w-+.]+\/)*$/
const port = /^[0-9]{4}:[0-9]{4}$/
const volume = /^\/((?!-)[\w-.]+\/)*:\/((?!-)[\w-.]+\/)*$/

module.exports = Joi.object().keys({
  name,
  password: Joi.string()
    .trim()
    .regex(password)
    .min(8)
    .max(30),
  port: Joi.string()
    .trim()
    .regex(port)
    .required(),
  path: Joi.string()
    .trim()
    .regex(path)
    .required(),
  auth: Joi.boolean().required(),
  http: Joi.boolean().required(),
  volumes: Joi.array()
    .items(
      Joi.string()
        .trim()
        .regex(volume)
    )
    .required(),
  ports: Joi.array()
    .items(
      Joi.string()
        .trim()
        .regex(port)
    )
    .required()
})
