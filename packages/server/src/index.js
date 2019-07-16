const app = require('./app')
const logger = require('./utils/winston')

// PORT and HOST are set to the MULTIVERSE_x env variables so they don't clash with any other applications
const PORT = process.env.MULTIVERSE_PORT || 3000
const HOST = process.env.MULTIVERSE_HOST || '0.0.0.0'

app.listen(PORT, HOST, () =>
  logger.info(`Multiverse listening on ${HOST}:${PORT}`)
)
