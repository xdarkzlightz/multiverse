const app = require('./app')
const logger = require('./utils/winston')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

app.listen(PORT, HOST, () =>
  logger.info(`Multiverse listening on ${HOST}:${PORT}`)
)
