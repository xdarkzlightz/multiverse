const logger = require('../utils/winston')

module.exports = (err, req, res, next) => {
  logger.error(err.stack)
  res.status(500).send()
}
