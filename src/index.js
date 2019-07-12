const app = require('./app')
const logger = require('./utils/winston')

const HOST = process.env.MULTIVERSE_PORT || 3000
const PORT = process.env.MULTIVERSE_HOST || '0.0.0.0'

app.listen(PORT, HOST, () =>
  logger.info(`Multiverse listening on ${HOST}:${PORT}`)
)
