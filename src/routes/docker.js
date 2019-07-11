const express = require('express')
const Docker = require('dockerode')

const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()
const docker = new Docker()

router.get(
  '/containers',
  asyncHandler(async (req, res) => {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ['multiverse=true'] }
    })
    const filtered = containers.filter(c => c.Image === 'codercom/code-server')

    res.send({
      containers: filtered.map(c => ({
        name: c.Labels['multiverse.project'],
        id: c.Id,
        running: c.State === 'running',
        port: c.Labels['multiverse.port'] || '8443'
      }))
    })
  })
)

router.post(
  '/containers',
  asyncHandler(async (req, res) => {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ['multiverse=true'] }
    })
    const filtered = containers.filter(c => c.Image === 'codercom/code-server')

    let nameExists
    let portInUse

    filtered.forEach(c => {
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
      return res.status(400).send({
        message: `A project with the name ${req.body.name} already exists`
      })
    } else if (portInUse) {
      return res.status(400).send({
        message: `Host port ${portInUse} is in use`
      })
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
  asyncHandler(async (req, res) => {
    const container = await docker.getContainer(req.params.id)
    const details = await container.inspect()
    if (
      !details.Config.Labels.multiverse ||
      !details.Config.Image === 'codercom/code-server'
    ) {
      return res.status(403).send()
    }

    await container.stop()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/kill',
  asyncHandler(async (req, res) => {
    const container = await docker.getContainer(req.params.id)
    const details = await container.inspect()
    if (
      !details.Config.Labels.multiverse ||
      !details.Config.Image === 'codercom/code-server'
    ) {
      return res.status(403).send()
    }

    await container.kill()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/remove',
  asyncHandler(async (req, res) => {
    const container = await docker.getContainer(req.params.id)
    const details = await container.inspect()
    if (
      !details.Config.Labels.multiverse ||
      !details.Config.Image === 'codercom/code-server'
    ) {
      return res.status(403).send()
    }

    await container.remove()
    res.status(204).send()
  })
)

router.post(
  '/containers/:id/start',
  asyncHandler(async (req, res) => {
    const container = await docker.getContainer(req.params.id)
    const details = await container.inspect()
    if (
      !details.Config.Labels.multiverse ||
      !details.Config.Image === 'codercom/code-server'
    ) {
      return res.status(403).send()
    }

    await container.start()
    res.status(204).send()
  })
)

module.exports = router
