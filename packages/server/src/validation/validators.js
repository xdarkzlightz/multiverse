export { default as name } from './name'
export { default as password } from './password'
export { default as path } from './path'
export { default as port } from './port'
export { default as volume } from './volume'
export { default as schema } from './schema'

module.exports = {
  name: require('./name'),
  password: require('./password'),
  path: require('./path'),
  port: require('./port'),
  volume: require('./volume'),
  schema: require('./schema')
}
