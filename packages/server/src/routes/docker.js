const express = require('express')
const validator = require('express-joi-validation').createValidator({
  passError: true
})
const containerErrorHandler = require('../middlewares/containerErrorHandler')
const asyncHandler = require('../middlewares/asyncHandler')
const {
  getContainers,
  createContainer,
  stopContainer,
  killContainer,
  removeContainer,
  startContainer
} = require('../controllers/docker')
// const validateContainers = require('../middlewares/validateContainer')
const validationErrorHandler = require('../middlewares/validationErrorHandler')
const schema = require('../validation/schema')
const id = require('../validation/containerId')

const router = express.Router()
router.post(
  '/containers',
  validator.body(schema),
  // validateContainers,
  asyncHandler(createContainer)
)

router.get('/containers', asyncHandler(getContainers))

router.delete(
  '/containers/:id',
  validator.params(id),
  asyncHandler(removeContainer)
)

router.post(
  '/containers/:id/stop',
  validator.params(id),
  asyncHandler(stopContainer)
)

router.post(
  '/containers/:id/kill',
  validator.params(id),
  asyncHandler(killContainer)
)

router.post(
  '/containers/:id/start',
  validator.params(id),
  asyncHandler(startContainer)
)

router.use(validationErrorHandler)
router.use(containerErrorHandler)

module.exports = router
