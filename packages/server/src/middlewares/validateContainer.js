const Docker = require('../services/DockerService')

const docker = new Docker()

module.exports = async (req, res, next) => {
  const containers = await docker.getContainers()
  const { name } = req.body

  const nameInUse = containers.some(
    c => c.Labels['multiverse.project'] === name
  )
  if (nameInUse) {
    return res.status(400).send(`Name ${name} is already in use`)
  }

  next()
}
