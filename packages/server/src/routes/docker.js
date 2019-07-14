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
router.post('/containers', asyncHandler(createContainer))

router.get('/containers', asyncHandler(getContainers))

router.delete('/containers/:id', asyncHandler(removeContainer))

router.post('/containers/:id/stop', asyncHandler(stopContainer))

router.post('/containers/:id/kill', asyncHandler(killContainer))

router.post('/containers/:id/start', asyncHandler(startContainer))

router.use(containerErrorHandler)

module.exports = router
