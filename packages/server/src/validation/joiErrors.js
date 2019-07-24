const FriendlyError = require('../errors/FriendlyError')

const reasons = {
  'any.required': '%LABEL is required.',
  'any.empty': '%LABEL cannot be empty.',
  'string.base': "%LABEL has to be type 'string'.",
  'string.min': '%LABEL has to be over %LIMIT characters.',
  'string.max': '%LABEL has to be under %LIMIT characters.',
  'string.regex.base': 'invalid character in %LABEL (%CHARS only).',
  'array.base': "%LABEL has to be type 'array'.",
  'array.length': '%LABEL must contain at least %LIMIT items.',
  'array.includesOne': 'invalid item in %LABEL at position %POS'
}

module.exports = errs => {
  let errors = []
  errs.forEach(err => {
    if (err.type === 'object.allowUnknown') {
      throw new FriendlyError(`Unkown field ${err.context.key}.`)
    }

    err.context.reason.forEach(reason => {
      const { label, limit, pos } = reason.context
      const type = reason.type
      if (reasons[type] && (type !== 'string.regex.base' && label !== 'path')) {
        const variables = {
          '%LABEL': label,
          '%LIMIT': limit,
          '%POS': pos,
          '%CHARS': reason.type === 'name' ? 'a-z A-Z .-_' : 'a-z A-Z'
        }
        const regex = /%LABEL|%LIMIT|%POS/g
        const msg = reasons[reason.type].replace(regex, m => variables[m])
        errors.push(msg)
      } else {
        errors.push(reason.type)
      }
    })
  })

  throw new FriendlyError(errors)
}
