const DockerService = require('../services/DockerService')

const docker = new DockerService()

module.exports.getContainers = async ctx => {
  let containers = await docker.getContainers()

  if (!ctx.state.user.admin) {
    containers = containers.filter(
      ({ Labels }) => Labels['multiverse.userId'] === ctx.state.user.id
    )
  }

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
    c => c.Labels['multiverse.project'] === ctx.request.body.name
  )
  if (nameInUse) {
    ctx.response.status = 400
    ctx.body = `name ${ctx.request.body.name} is already in use.`
    return
  }

  const container = await docker.createContainer({
    ...ctx.request.body,
    userId: ctx.state.user.id
  })
  ctx.body = { id: container.id }
  ctx.response.status = 201
}

module.exports.stopContainer = async ctx => {
  const { id, admin } = ctx.state.user
  await docker.stopContainer(ctx.params.id, id, admin)
  ctx.response.status = 204
}

module.exports.killContainer = async ctx => {
  const { id, admin } = ctx.state.user
  await docker.killContainer(ctx.params.id, id, admin)
  ctx.response.status = 204
}

module.exports.startContainer = async ctx => {
  const { id, admin } = ctx.state.user
  await docker.startContainer(ctx.params.id, id, admin)

  ctx.response.status = 204
}

module.exports.removeContainer = async ctx => {
  const { id, admin } = ctx.state.user
  await docker.removeContainer(ctx.params.id, id, admin)
  ctx.response.status = 204
}
