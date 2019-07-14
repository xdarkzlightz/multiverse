const express = require('express')
const {
  getContainers,
  createContainer,
  stopContainer,
  killContainer,
  removeContainer,
  startContainer
} = require('../controllers/docker')

const router = express.Router()

router.get('/containers', getContainers)

router.post('/containers', createContainer)

router.post('/containers/:id/stop', stopContainer)

router.post('/containers/:id/kill', killContainer)

router.post('/containers/:id/remove', removeContainer)

router.post('/containers/:id/start', startContainer)

module.exports = router
