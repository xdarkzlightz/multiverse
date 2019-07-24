const DockerService = require('../services/DockerService')

const docker = new DockerService()

module.exports.getContainers = async ctx => {
  const containers = await docker.getContainers()
  ctx.body = containers.map(c => ({
    id: c.Id,
    name: c.Labels['multiverse.project'],
    running: c.State === 'running',
    port: c.Labels['multiverse.port'] || '8443'
  }))
  ctx.response.status = 200
}

module.exports.createContainer = async ctx => {
  const containers = await docker.getContainers()
  const nameInUse = containers.some(
    c => c.Labels['multiverse.project'] === ctx.request.body
  )
  if (nameInUse) {
    ctx.body = `name ${ctx.request.body.name} is already in use.`
    return
  }

  const container = await docker.createContainer(ctx.request.body)
  ctx.body = { id: container.id }
  ctx.response.status = 201
}

module.exports.stopContainer = async ctx => {
  await docker.stopContainer(ctx.params.id)
  ctx.response.status = 204
}

module.exports.killContainer = async ctx => {
  await docker.killContainer(ctx.params.id)
  ctx.response.status = 204
}

module.exports.startContainer = async ctx => {
  await docker.startContainer(ctx.params.id)
  ctx.response.status = 204
}

module.exports.removeContainer = async ctx => {
  await docker.removeContainer(ctx.params.id)
  ctx.response.status = 204
}
