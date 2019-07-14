const DockerService = require('../services/docker')
const logger = require('../utils/winston')

const docker = new DockerService()

/*
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
*/
const getContainers = async (req, res) => {
  try {
    const containers = await docker.getContainers()
    res.status(200).send(
      containers.map(c => ({
        id: c.Id,
        name: c.Labels['multiverse.project'],
        running: c.State === 'running',
        port: c.Labels['multiverse.port'] || '8443'
      }))
    )
  } catch (e) {
    logger.error(e.stack)
    res.status(500).send()
  }
}

const createContainer = async (req, res) => {
  const container = await docker.createContainer(req.body)
  res.status(201).send({ id: container.id })
}

const startContainer = async (req, res) => {
  try {
    await docker.startContainer(req.params.id)
    res.status(204).send()
  } catch (e) {
    if (e.name === 'ContainerAccessError') {
      return res.status(403).send(e.message)
    } else if (e.name === 'ContainerStartedError') {
      return res.status(400).send(e.message)
    }
    logger.error(e.stack)
    res.status(500).send()
  }
}

const stopContainer = async (req, res) => {
  try {
    await docker.stopContainer(req.params.id)
    res.status(204).send()
  } catch (e) {
    if (e.name === 'ContainerAccessError') {
      return res.status(403).send(e.message)
    } else if (e.name === 'ContainerStoppedError') {
      return res.status(400).send(e.message)
    }
    logger.error(e.stack)
    res.status(500).send()
  }
}

const killContainer = async (req, res) => {
  try {
    await docker.killContainer(req.params.id)
    res.status(204).send()
  } catch (e) {
    if (e.name === 'ContainerAccessError') {
      return res.status(403).send(e.message)
    } else if (e.name === 'ContainerStoppedError') {
      return res.status(400).send(e.message)
    }
    logger.error(e.stack)
    res.status(500).send()
  }
}

const removeContainer = async (req, res) => {
  try {
    await docker.removeContainer(req.params.id)
    return res.status(204).send()
  } catch (e) {
    if (e.name === 'ContainerAccessError') {
      return res.status(403).send(e.message)
    } else if (e.name === 'NoContainerError') {
      return res.status(400).send(e.message)
    }
    logger.error(e.stack)
    res.status(500).send()
  }
}

module.exports = {
  getContainers,
  createContainer,
  startContainer,
  stopContainer,
  killContainer,
  removeContainer
}
