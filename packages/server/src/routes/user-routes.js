const Router = require('koa-router')
const passport = require('koa-passport')
const validate = require('koa-joi-validate')
const schema = require('../validation/userSchema')
const ctl = require('../controllers/user-controller')

const router = new Router()
const BASE_URL = '/api/users'

const validator = validate({
  body: schema
})

// Middleware for checking if the user sending the request is an admin
const adminOnly = async (ctx, next) => {
  if (!ctx.state.user.admin) {
    ctx.status = 401
    return
  }
  await next()
}

const checkUser = async (ctx, next) => {
  if (ctx.state.user.id !== ctx.params.id && !ctx.state.user.admin) {
    ctx.status = 401
    return
  }

  await next()
}

// Create a new user
router.post(
  BASE_URL,
  passport.authenticate('jwt', { session: false }),
  validator,
  adminOnly,
  ctl.createUser
)

// Get all users
router.get(
  BASE_URL,
  passport.authenticate('jwt', { session: false }),
  adminOnly,
  ctl.getUsers
)

// Get a single user
router.get(
  `${BASE_URL}/:id`,
  passport.authenticate('jwt', { session: false }),
  checkUser,
  ctl.getUser
)

// Update a user
router.patch(
  `${BASE_URL}/:id`,
  passport.authenticate('jwt', { session: false }),
  checkUser,
  ctl.updateUser
)

// Delete a user
router.delete(
  `${BASE_URL}/:id`,
  passport.authenticate('jwt', { session: false }),
  adminOnly,
  ctl.deleteUser
)

// Reset a users password
router.patch(
  `${BASE_URL}/:id/resetPassword`,
  passport.authenticate('jwt', { session: false }),
  adminOnly,
  ctl.resetPassword
)

// Update a users password
router.patch(
  `${BASE_URL}/:id/updatePassword`,
  passport.authenticate('jwt', { session: false }),
  checkUser,
  ctl.updatePassword
)

module.exports = router
