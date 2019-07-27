const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const join = require('path').join
const User = require('../models/User')
const logger = require('../utils/winston')
const FriendlyError = require('../errors/FriendlyError')

// For now sqlite is just gonna be used for storing user data
// There will be options in the config file to use a different provider
module.exports = class UserService {
  constructor () {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: join(process.cwd(), '/users.sqlite3'),
      logging: msg => logger.debug(msg)
    })

    this.user = User(this.sequelize)
    this.connection = false
  }

  async connect () {
    if (this.connection) return
    await this.sequelize.authenticate()
    logger.debug('Connected to sqlite database')

    this.connection = true

    await this.user.sync()
    logger.debug('Synchronised user model')

    const exists = await this.getUser('admin')
    if (!exists) {
      await this.createUser({ username: 'admin', password: 'password' })
    }
  }

  async close () {
    await this.sequelize.close()
    logger.debug('Closed the connection')
  }

  // Attempts to create a new user
  // Throws a friendly error if the username is in use
  async createUser ({ username, password }) {
    await this.connect()
    const exists = await this.getUser(username)

    if (exists) {
      throw new FriendlyError('Username already in use')
    }
    const hash = await bcrypt.hash(password, 12)
    const user = await this.user.create({ username, password: hash })
    logger.info(`Created new user ${user.username}, id: ${user.id}`)

    return user
  }

  // Fetches all users in the database
  async getUsers () {
    await this.connect()
    const users = await this.user.findAll()
    logger.info(`Fetched ${users.length} users`)
    return users
  }

  // Attempts to fetch a user by their id
  // Throws a friendly error if no user is found
  async getUserById (id) {
    await this.connect()
    const user = await this.user.findOne({ where: { id } })

    if (user) {
      logger.info(`Fetched user ${user.username} (${user.id})`)
      return user
    } else {
      throw new FriendlyError(`No such user with id ${id}`)
    }
  }

  // Attempts to fetch a user by their username
  // Returns false if no user is found
  async getUser (username) {
    await this.connect()
    const user = await this.user.findOne({
      where: {
        username
      }
    })

    if (user) {
      logger.info(`Fetched user ${user.username} (${user.id})`)
      return user
    } else {
      return false
    }
  }

  // Attempts to delete a user by their id
  async deleteUser (id) {
    await this.connect()
    const user = await this.getUserById(id)
    await user.destroy()
    logger.info(`Deleted user ${id}`)
  }

  // Attempts to update a user's username by their id
  async updateUser (id, { username }) {
    await this.connect()
    const user = await this.getUserById(id)
    await user.update({ username })
    logger.info(`Updated user ${id}`)
  }

  // Changes a users password without checking the old one
  // Intended for admins
  async resetPassword (id, password) {
    await this.connect()
    const user = await this.getUserById(id)
    const hash = await bcrypt.hash(password, 12)
    await user.update({ password: hash })
    logger.info(`Reset password for user ${id}`)
  }

  // Attempts to update a users password
  // Intended for users
  async updatePassword (id, oldPassword, newPassword) {
    await this.connect()
    const user = await this.getUserById(id)
    const match = await bcrypt.compare(oldPassword, user.password)

    if (match) {
      const hash = await bcrypt.hash(newPassword, 12)
      await user.update({ password: hash })
    } else {
      throw new FriendlyError('Invalid password')
    }
  }
}
