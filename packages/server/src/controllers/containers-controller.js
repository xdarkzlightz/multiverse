const DockerService = require('../services/DockerService')
const UserService = require('../services/UserService')
const logger = require('../utils/winston')

const docker = new DockerService()
const userService = new UserService()

module.exports.getContainers = async ctx => {
  let containers = await docker.getContainers()

  if (!ctx.state.user.admin) {
    containers = containers.filter(
      ({ Labels }) => Labels['multiverse.userId'] === ctx.state.user.id
    )
  }

  const mappedContainers = containers.map(c => ({
    id: c.Id,
    name: c.Labels['multiverse.project'],
    running: c.State === 'running',
    port: c.Labels['multiverse.port'] || '8443',
    userId: c.Labels['multiverse.userId']
  }))

  const promises = []
  mappedContainers.forEach(c => {
    const userPromise = userService
      .getUserById(c.userId)
      .then(user => (c.username = user.username))
      .catch(e => logger.error(e))
    promises.push(userPromise)

    const dockerPromise = docker
      .getContainer(c.id, ctx.state.user.id, ctx.state.user.admin, true)
      .then(data => {
        c.createdAt = data.Created
      })
      .catch(e => logger.error(e))
    promises.push(dockerPromise)
  })
  await Promise.all(promises)
  ctx.body = mappedContainers
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

module.exports.authProject = async ctx => {
  const { id } = ctx.state.user
  const containers = await docker.getContainers()
  const container = containers.filter(
    c => c.Labels[`multiverse.project`] === ctx.params.project
  )[0]

  container.Labels['multiverse.userId'] === id
    ? (ctx.status = 204)
    : (ctx.status = 401)
}
