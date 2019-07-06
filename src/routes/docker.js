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
        running: c.State === 'running',
        port: c.Labels['coder.port'] || '8443'
      }))
    })
  } catch (e) {
    console.log(`${e.stack}`)
    res.status(500).send({ message: 'Something went wrong...' })
  }
})

router.post('/containers', async (req, res) => {
  try {
    const http = req.body.http ? '--allow-http' : ''
    const auth = req.body.auth ? '' : '--no-auth'
    const container = await docker.createContainer({
      Image: 'codercom/code-server',
      Env: [`PORT=${req.body.port}`, `PASSWORD=${req.body.password}`],
      Entrypoint: ['dumb-init', 'code-server', http, auth],
      name: req.body.name,
      ExposedPorts: { [req.body.port]: {} },
      Labels: { [`coder.port`]: req.body.port },
      HostConfig: {
        PortBindings: { [req.body.port]: [{ HostPort: req.body.port }] },
        Binds: [`${req.body.path}:/home/coder/project`]
      }
    })

    container.start(() => res.status(204).send())
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
    res.status(204).send()
  } catch (e) {
    console.log(e.stack)
  }
})

router.post('/containers/:id/kill', async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id)
    await container.kill()
    res.status(204).send()
  } catch (e) {
    console.log(e.stack)
  }
})

router.post('/containers/:id/remove', async (req, res) => {
  try {
    const container = await docker.getContainer(req.params.id)
    await container.remove()
    res.status(204).send()
  } catch (e) {
    console.log(e.stack)
  }
})

module.exports = router
