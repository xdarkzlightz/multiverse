const Sequelize = require('sequelize')
const User = require('../models/User')
const join = require('path').join
const logger = require('../utils/winston')

// For now sqlite is just gonna be used for storing user data
// There will be options in the config file to use a different provider
module.exports = class UserService {
  constructor () {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: join(process.cwd(), '/users.sqlite3')
    })

    this.user = User(this.sequelize)
  }

  async connect () {
    await this.sequelize.authenticate()
    logger.debug('Connected to sqlite database')

    await this.user.sync()
    logger.debug('Synchronised user model')
  }

  async close () {
    await this.sequelize.close()
    logger.debug('Closed the connection')
  }

  async createUser (data) {
    try {
      await this.connect()

      const user = await this.user.create(data)
      logger.info(`Created new user ${user.username}, id: ${user.id}`)

      return user
    } catch (e) {
      logger.error(e.message)
    }
  }

  async getUsers () {
    try {
      await this.connect()
      const users = await this.user.findAll()
      logger.info(`Fetched ${users.length} users`)
      return users
    } catch (e) {
      logger.error(e.message)
    }
  }

  async getUserById (id) {
    try {
      await this.connect()
      const user = await this.user.findOne({ id })
      logger.info(`Fetched user ${user.username} (${user.id})`)
      return user
    } catch (e) {
      logger.error(e.message)
    }
  }

  async getUser (username, password) {
    try {
      await this.connect()
      const user = await this.user.findOne({
        where: {
          username,
          password
        }
      })
      logger.info(`Fetched user ${user.username} (${user.id})`)
      return user
    } catch (e) {
      logger.error(e.message)
    }
  }

  async deleteUser (id) {
    try {
      await this.connect()
      await this.user.destroy({ where: { id } })
      logger.info(`Deleted user ${id}`)
    } catch (e) {
      logger.error(e.message)
    }
  }

  async updateUser (id, data) {
    try {
      await this.connect()
      await this.user.update(data, { where: { id } })
      logger.info(`Updated user ${id}`)
    } catch (e) {
      logger.error(e.message)
    }
  }
}
