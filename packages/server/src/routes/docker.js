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

const validateContainer = (req, res, next) => {
  const { name, port, ports } = req.body
  const [host, cont] = port.split(':')

  const nameInUse = req.containers.some(
    c => c.Labels['multiverse.project'] === name
  )
  if (nameInUse) {
    return res
      .status(400)
      .send(`A project with the name ${req.body.name} already exists`)
  }

  const validatePorts = p => {
    if (`${p.PublicPort}` === host) return false
    const iPort = ports.map(p => p.split(':')[0]).includes(`${p.PublicPort}`)
    const hPort = ports.map(p => p.split(':')[0]).includes(`${p.PublicPort}`)

    if (hPort) return false
    return true
  }

  const portInUse = req.containers.some(c =>
    c.Ports.some(p => validatePorts(p))
  )
  console.log(req.containers[0])

  if (portInUse) {
    return res.status(400).send(`Host port ${portInUse} is in use`)
  }

  next()
}

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
  validateContainer,
  asyncHandler(async (req, res) => {
    const { name, password, port, path, ports, volumes, http, auth } = req.body
    const [host, cont] = port.split(':')
    const ExposedPorts = { [cont]: {} }
    const PortBindings = { [cont]: [{ HostPort: host }] }
    ports.forEach(p => {
      const [host, cont] = p.split(':')
      ExposedPorts[cont] = {}
      PortBindings[cont] = [{ HostPort: host }]
    })

    const container = await docker.createContainer({
      Image: 'codercom/code-server',
      Env: [`PORT=${cont}`, `PASSWORD=${password}`],
      Entrypoint: [
        'dumb-init',
        'code-server',
        http ? '--allow-http' : '',
        auth ? '' : '--no-auth'
      ],
      ExposedPorts,
      Labels: {
        multiverse: 'true',
        [`multiverse.port`]: host,
        [`multiverse.project`]: name
      },
      HostConfig: {
        PortBindings,
        Binds: [`${path}:/home/coder/project`, ...volumes]
      }
    })

    await container.start()
    res.status(201).send()
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
