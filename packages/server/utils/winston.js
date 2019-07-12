const { createLogger, transports, format } = require('winston')

const env = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

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
  write: function (message, encoding) {
    logger.info(message)
  }
}

module.exports = logger
