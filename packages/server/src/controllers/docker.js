const DockerService = require('../services/docker')

const docker = new DockerService()

const getContainers = async (req, res) => {
  const containers = await docker.getContainers()
  res.status(200).send(
    containers.map(c => ({
      id: c.Id,
      name: c.Labels['multiverse.project'],
      running: c.State === 'running',
      port: c.Labels['multiverse.port'] || '8443'
    }))
  )
}

const createContainer = async (req, res) => {
  const container = await docker.createContainer(req.body)
  res.status(201).send({ id: container.id })
}

const startContainer = async (req, res) => {
  await docker.startContainer(req.params.id)
  res.status(204).send()
}

const stopContainer = async (req, res) => {
  await docker.stopContainer(req.params.id)
  res.status(204).send()
}

const killContainer = async (req, res) => {
  await docker.killContainer(req.params.id)
  res.status(204).send()
}

const removeContainer = async (req, res) => {
  await docker.removeContainer(req.params.id)
  return res.status(204).send()
}

module.exports = {
  getContainers,
  createContainer,
  startContainer,
  stopContainer,
  killContainer,
  removeContainer
}
