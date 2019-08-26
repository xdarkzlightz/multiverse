const join = require('path').join
const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  require('dotenv').config({ path: join(__dirname, 'dev.env') })
} else if (env === 'test') {
  // return object
} else if (env === 'production') {
  require('dotenv').config()
}

module.exports = {
  // Node environment
  ENV: env,
  // Port and host the server should be listening on
  PORT: process.env.PORT || 8080,
  HOST: process.env.HOST || '0.0.0.0',
  // JWT secret
  SECRET: process.env.SECRET || 'secret',
  // The host so traefik can do forward authentication on projects
  PROJECT_HOST: process.env.PROJECT_HOST,
  // The network traefik is connected to
  NETWORK: process.env.NETWORK,
  // The traefik backend for multiverse
  BACKEND: process.env.BACKEND,
  // Host, Port, and Database mongoose should use
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB,
  // Default admin password
  PASSWORD: process.env.PASSWORD || 'password'
}
