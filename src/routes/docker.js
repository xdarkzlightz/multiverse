const express = require('express')
const Docker = require('dockerode')
const validator = require('express-joi-validation').createValidator()
const schema = require('../validation/schema')

const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()
const docker = new Docker()

const getContainer = asyncHandler(async (req, res, next) => {
  const container = await docker.getContainer(req.params.id)
  const details = await container.inspect()
  if (
    !details.Config.Labels.multiverse ||
    !details.Config.Image === 'codercom/code-server'
  ) {
    return res.status(403).send()
  }

  req.container = container
  next()
})

const getContainers = asyncHandler(async (req, res, next) => {
  const containers = await docker.listContainers({
    all: true,
    filters: { label: ['multiverse=true'] }
  })
  req.containers = containers.filter(c => c.Image === 'codercom/code-server')
  next()
})

router.get('/containers', getContainers, async (req, res) => {
  res.status(200).send({
    containers: req.containers.map(c => ({
      id: c.Id,
      name: c.Labels['multiverse.project'],
      running: c.State === 'running',
      port: c.Labels['multiverse.port'] || '8443'
    }))
  })
})

router.post(
  '/containers',
  validator.body(schema),
  getContainers,
  asyncHandler(async (req, res) => {
    let nameExists
    let portInUse

    req.containers.forEach(c => {
      if (c.Labels['multiverse.project'] === req.body.name) {
        return (nameExists = true)
      }
      if (portInUse) return
      c.Ports.forEach(p => {
        const codrPort = `${p.PublicPort}` === req.body.port
        const addPort = req.body.ports
          .map(p => p.split(':')[0])
          .includes(`${p.PublicPort}`)
        if (codrPort || addPort) {
          portInUse = p.PublicPort
        }
      })
    })

    if (nameExists) {
      return res
        .status(400)
        .send(`A project with the name ${req.body.name} already exists`)
    } else if (portInUse) {
      return res.status(400).send(`Host port ${portInUse} is in use`)
    }
    const ExposedPorts = { [req.body.port]: {} }
    const PortBindings = { [req.body.port]: [{ HostPort: req.body.port }] }
    const http = req.body.http ? '--allow-http' : ''
    const auth = req.body.auth ? '' : '--no-auth'

    req.body.ports.forEach(p => {
      const [host, cont] = p.split(':')

      ExposedPorts[cont] = {}
      PortBindings[cont] = [{ HostPort: host }]
    })

    const container = await docker.createContainer({
      Image: 'codercom/code-server',
      Env: [`PORT=${req.body.port}`, `PASSWORD=${req.body.password}`],
      Entrypoint: ['dumb-init', 'code-server', http, auth],
      name: req.body.name,
      ExposedPorts,
      Labels: {
        multiverse: 'true',
        [`multiverse.port`]: req.body.port,
        [`multiverse.project`]: req.body.name
      },
      HostConfig: {
        PortBindings,
        Binds: [`${req.body.path}:/home/coder/project`, ...req.body.volumes]
      }
    })

    await container.start()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/stop',
  getContainer,
  asyncHandler(async (req, res) => {
    await req.container.stop()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/kill',
  getContainer,
  asyncHandler(async (req, res) => {
    await req.container.kill()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/remove',
  getContainer,
  asyncHandler(async (req, res) => {
    await req.container.remove()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/start',
  getContainer,
  asyncHandler(async (req, res) => {
    await req.container.start()
    res.status(204).send()
  })
)

module.exports = router
