const Router = require('koa-router')
const validate = require('koa-joi-validate')
const passport = require('koa-passport')
const ctl = require('../controllers/containers-controller')
const schema = require('../validation/schema')
const containerId = require('../validation/containerId')

const containerValidator = validate({
  body: schema
})
const idValidator = validate({
  params: containerId
})

const router = new Router()
const BASE_URL = '/api/containers'

router.get(
  BASE_URL,
  passport.authenticate('jwt', { session: false }),
  ctl.getContainers
)

router.post(
  BASE_URL,
  containerValidator,
  passport.authenticate('jwt', { session: false }),
  ctl.createContainer
)

router.delete(
  `${BASE_URL}/:id`,
  idValidator,
  passport.authenticate('jwt', { session: false }),
  ctl.removeContainer
)

router.post(
  `${BASE_URL}/:id/stop`,
  idValidator,
  passport.authenticate('jwt', { session: false }),
  ctl.stopContainer
)

router.post(
  `${BASE_URL}/:id/kill`,
  idValidator,
  passport.authenticate('jwt', { session: false }),
  ctl.killContainer
)

router.post(
  `${BASE_URL}/:id/start`,
  idValidator,
  passport.authenticate('jwt', { session: false }),
  ctl.startContainer
)

module.exports = router
