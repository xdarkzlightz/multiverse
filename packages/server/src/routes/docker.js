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
const validateContainers = require('../middlewares/validateContainer')
const validationErrorHandler = require('../middlewares/validationErrorHandler')
const schema = require('../validation/schema')
const id = require('../validation/containerId')

const router = express.Router()
// Creates a new container
router.post(
  '/containers',
  validator.body(schema),
  validateContainers,
  asyncHandler(createContainer)
)

// Gets an array of containers
router.get('/containers', asyncHandler(getContainers))

// Deletes a container by it's id
router.delete(
  '/containers/:id',
  validator.params(id),
  asyncHandler(removeContainer)
)

// Stops a container by it's id
router.post(
  '/containers/:id/stop',
  validator.params(id),
  asyncHandler(stopContainer)
)

// Kills a container by it's id
router.post(
  '/containers/:id/kill',
  validator.params(id),
  asyncHandler(killContainer)
)

// Starts a container by it's id
router.post(
  '/containers/:id/start',
  validator.params(id),
  asyncHandler(startContainer)
)

router.use(validationErrorHandler)
router.use(containerErrorHandler)

module.exports = router
