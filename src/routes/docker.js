const express = require('express')
const Docker = require('dockerode')

const router = express.Router()
const docker = new Docker()

router.get('/containers', async (req, res) => {
  const containers = await docker.listContainers()

  res.send({
    containers: containers.map(c => ({ name: c.Names[0], id: c.Id }))
  })
})

router.get('/containers/:id', async (req, res) => {
  const container = await docker.getContainer(req.params.id)

  res.send({ container: { id: container.id } })
})

router.post('/containers', async (req, res) => {
  await docker.createContainer({
    image: 'hello-world',
    name: 'hello world test'
  })
})

router.post('/containers/:id/stop', async (req, res) => {
  const container = await docker.getContainer(req.params.id)

  await container.stop()
})

router.post('/containers/:id/kill', async (req, res) => {
  const container = await docker.getContainer(req.params.id)

  await container.kill()
})

module.exports = router
