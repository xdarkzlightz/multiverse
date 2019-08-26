const app = require('./app')
const { HOST, PORT } = require('./config/config')
const logger = require('./utils/winston')

const server = app().then(app =>
  app.listen(PORT, HOST, () =>
    logger.info(`Multiverse listening on http://${HOST}:${PORT}`)
  )
)

module.exports = server
