const express = require('express')
const Docker = require('dockerode')

const router = express.Router()
const docker = new Docker()

router.get('/containers', async (req, res) => {
  const containers = await docker.listContainers({ all: true })
  const filtered = containers.filter(c => c.Image === 'codercom/code-server')
  res.send({
    containers: filtered.map(c => ({ name: c.Names[0], id: c.Id }))
  })
})

router.get('/containers/:id', async (req, res) => {
  const container = await docker.getContainer(req.params.id)

  res.send({ container: { id: container.id } })
})

router.post('/containers', async (req, res) => {
  await docker.run('codercom/code-server', ['--no-auth'])
  res.send({ message: 'OK' })
})

router.post('/containers/:id/stop', async (req, res) => {
  const container = await docker.getContainer(req.params.id)

  await container.stop()

  res.send({ message: 'OK' })
})

router.post('/containers/:id/kill', async (req, res) => {
  const container = await docker.getContainer(req.params.id)

  await container.kill()
})

module.exports = router
