const express = require('express')
const Docker = require('dockerode')

const router = express.Router()
const docker = new Docker()

router.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true })
    const filtered = containers.filter(c => c.Image === 'codercom/code-server')

    res.send({
      containers: filtered.map(c => ({
        name: c.Names[0].substring(1),
        id: c.Id,
        running: c.State === 'running'
      }))
    })
  } catch (e) {
    console.log(`${e.stack}`)
    res.status(500).send({ message: 'Something went wrong...' })
  }
})

router.post('/containers', async (req, res) => {
  try {
    const container = await docker.createContainer({
      Image: 'codercom/code-server',
      name: req.body.name
    })

    container.start(() => {
      res.send('OK')
    })
  } catch (e) {
    console.log(e.stack)
    if (e.message.includes('(HTTP code 409) unexpected - Conflict.')) {
      res
        .status(400)
        .send({ message: `Project name ${req.body.name} is in use.` })
    }
  }
})

router.get('/containers/:id', async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id)
    res.send({ container: { id: container.id } })
  } catch (e) {
    console.log(e.stack)
  }
})

router.post('/containers/:id/stop', async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id)
    await container.stop()
    res.status(200)
  } catch (e) {
    console.log(e.stack)
  }
})

router.post('/containers/:id/kill', async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id)
    await container.kill()
    res.status(204)
  } catch (e) {
    console.log(e.stack)
  }
})

router.post('/containers/:id/remove', async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id)
    await container.remove()
    res.status(204)
  } catch (e) {
    console.log(e.stack)
  }
})

module.exports = router
