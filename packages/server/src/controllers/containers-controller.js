const DockerService = require('../services/DockerService')
const UserService = require('../services/UserService')
const logger = require('../utils/winston')

const docker = new DockerService()
const userService = new UserService()

module.exports.getContainers = async ctx => {
  let projects = await docker.getContainers()

  if (!ctx.state.user.admin) {
    projects.projects = projects.projects.filter(
      ({ userId }) => userId === ctx.state.user.id
    )
  }

  const mappedProjects = projects.projects.map(p => {
    const container = projects.containers.filter(({ Id }) => p.containerId)
    return {
      id: p.containerId,
      name: p.name,
      running: container.State === 'running',
      userId: p.userId
    }
  })

  const promises = []
  mappedProjects.forEach(p => {
    const userPromise = userService
      .getUserById(p.userId)
      .then(user => (p.username = user.username))
      .catch(e => logger.error(e))
    promises.push(userPromise)

    const dockerPromise = docker
      .getContainer(p.id, ctx.state.user.id, ctx.state.user.admin, true)
      .then(({ data }) => {
        p.createdAt = data.Created
      })
      .catch(e => logger.error(e))
    promises.push(dockerPromise)
  })
  await Promise.all(promises)
  ctx.body = mappedProjects
  ctx.response.status = 200
}

module.exports.createContainer = async ctx => {
  const { projects } = await docker.getContainers()
  const nameInUse = projects.some(p => p.name === ctx.request.body.name)
  if (nameInUse) {
    ctx.response.status = 400
    ctx.body = `name ${ctx.request.body.name} is already in use.`
    return
  }

  const { container } = await docker.createContainer({
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
  const { projects } = await docker.getContainers()
  const project = projects.filter(p => p.name === ctx.params.project)[0]

  project.userId === id ? (ctx.status = 204) : (ctx.status = 401)
}
