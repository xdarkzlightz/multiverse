const Router = require('koa-router')
const validate = require('koa-joi-validate')
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

router.get(BASE_URL, ctl.getContainers)

router.post(BASE_URL, containerValidator, ctl.createContainer)

router.delete(`${BASE_URL}/:id`, idValidator, ctl.removeContainer)

router.post(`${BASE_URL}/:id/stop`, idValidator, ctl.stopContainer)

router.post(`${BASE_URL}/:id/kill`, idValidator, ctl.killContainer)

router.post(`${BASE_URL}/:id/start`, idValidator, ctl.startContainer)

module.exports = router
