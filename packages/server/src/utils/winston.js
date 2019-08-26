const { createLogger, transports, format } = require('winston')
const { ENV } = require('../config/config')

const env = ENV === 'production' ? 'info' : 'debug'

const logger = createLogger({
  level: env,
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console()]
})

logger.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}

module.exports = logger
