const Router = require('koa-router')
const ctl = require('../controllers/user-controller')

const router = new Router()
const BASE_URL = '/api/users'

// Create a new user
router.post(BASE_URL, ctl.createUser)

// Get all users
router.get(BASE_URL, ctl.getUsers)

// Get a single user
router.get(`${BASE_URL}/:id`, ctl.getUser)

// Update a user
router.patch(`${BASE_URL}/:id`, ctl.updateUser)

// Delete a user
router.delete(`${BASE_URL}/:id`, ctl.deleteUser)

// Reset a users password
router.patch(`${BASE_URL}/:id/resetPassword`, ctl.resetPassword)

// Update a users password
router.patch(`${BASE_URL}/:id/updatePassword`, ctl.updatePassword)

module.exports = router
