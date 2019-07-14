const express = require('express')
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

const router = express.Router()
router.get('/containers', asyncHandler(getContainers))

router.post('/containers', asyncHandler(createContainer))

router.post('/containers/:id/stop', asyncHandler(stopContainer))

router.post('/containers/:id/kill', asyncHandler(killContainer))

router.post('/containers/:id/remove', asyncHandler(removeContainer))

router.post('/containers/:id/start', asyncHandler(startContainer))

router.use(containerErrorHandler)

module.exports = router
