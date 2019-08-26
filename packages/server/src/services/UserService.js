const bcrypt = require('bcrypt')
const logger = require('../utils/winston')
const FriendlyError = require('../errors/FriendlyError')
const User = require('../models/User')
const dockerService = require('./DockerService')

const getUserById = async id => {
  const user = await User.findById(id).populate('projects')

  if (user) logger.debug(`Fetched user ${user.username} (${user.id})`)
  return user
}

const getUserByUsername = async username => {
  const user = await User.findOne({ username }).populate('projects')

  if (user) logger.debug(`Fetched user ${user.username} (${user.id})`)
  return user
}

// Attempts to create a new user
// Throws a friendly error if the username is in use
const createUser = async ({ username, password, admin }) => {
  const exists = await getUserByUsername(username)
  if (exists) {
    throw new FriendlyError('Username already in use')
  }
  const hash = await bcrypt.hash(password, 12)
  const user = new User({ username, password: hash, admin })
  await user.save()
  logger.debug(`Created new user ${user.username} (${user.id})`)

  return user
}

// Fetches all users in the database
const getUsers = async () => {
  const users = await User.find()
  logger.debug(`Fetched ${users.length} users`)
  return users
}

// Attempts to delete a user by their id
const deleteUser = async id => {
  const user = await getUserById(id)
  if (user.username === 'admin') {
    throw new FriendlyError('Cannot delete admin user')
  }

  await User.findByIdAndDelete(id)
  const promises = []
  user.projects.forEach(p => {
    const removeContainer = async () => {
      const { data } = await dockerService.getContainer(p.containerId)
      if (data.State.Running === true) {
        await dockerService.stopContainer(p.containerId)
      }
      await dockerService.removeContainer(p.containerId)
    }
    promises.push(removeContainer())
  })

  await Promise.all(promises)
  logger.debug(`Deleted user ${id}`)
}

// Attempts to update a user's properties by their id
const updateUser = async (id, { username }, adminId) => {
  const user = await getUserById(id)
  if (user.username === 'admin' && user.id !== adminId) {
    throw new FriendlyError('Only the admin user can update itself')
  }
  await user.update({ username })
  logger.debug(`Updated user ${user.username} (${id})`)
}

// Changes a users password without checking the old one
// Intended for admins
const resetPassword = async (id, password, adminId) => {
  const user = await getUserById(id)
  if (user.username === 'admin' && user.id !== adminId) {
    throw new FriendlyError('Only admin user can update itself')
  }
  const hash = await bcrypt.hash(password, 12)
  await user.update({ password: hash })
  logger.debug(`Reset password for user ${id}`)
}

// Attempts to update a users password
// Intended for users
const updatePassword = async (id, oldPassword, newPassword, adminId) => {
  const user = await getUserById(id)
  if (user.username === 'admin' && user.id !== adminId) {
    throw new FriendlyError('Only admin user can update itself')
  }
  const match = await bcrypt.compare(oldPassword, user.password)

  if (match) {
    const hash = await bcrypt.hash(newPassword, 12)
    await user.update({ password: hash })
  } else {
    throw new FriendlyError('Invalid password')
  }
}

module.exports = {
  getUserById,
  getUserByUsername,
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  resetPassword,
  updatePassword
}
