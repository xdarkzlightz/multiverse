const dockerService = require('../services/DockerService')
const projectService = require('../services/ProjectService')

module.exports.getContainers = async ctx => {
  let projects = await projectService.getProjects()

  if (!ctx.state.user.admin) {
    projects = projects.filter(({ author }) => author.id === ctx.state.user.id)
  }

  const mappedProjects = projects.map(p => {
    return {
      id: p._id,
      name: p.name,
      running: p.container.data.State.Running,
      userId: p.author.id,
      username: p.author.username,
      createdAt: p.container.data.Created
    }
  })

  ctx.body = mappedProjects
  ctx.response.status = 200
}

module.exports.createContainer = async ctx => {
  const projects = await projectService.getProjects()
  const nameInUse = projects.some(p => p.name === ctx.request.body.name)
  if (nameInUse) {
    ctx.response.status = 400
    ctx.body = `name ${ctx.request.body.name} is already in use.`
    return
  }

  const project = await projectService.createProject(ctx.state.user.id, {
    ...ctx.request.body
  })

  ctx.body = { id: project.id }
  ctx.response.status = 201
}

module.exports.stopContainer = async ctx => {
  const { id, admin } = ctx.state.user
  const project = await projectService.getProject(ctx.params.id)
  await dockerService.stopContainer(project.containerId, id, admin)
  ctx.response.status = 204
}

module.exports.killContainer = async ctx => {
  const { id, admin } = ctx.state.user
  const project = await projectService.getProject(ctx.params.id)
  await dockerService.killContainer(project.containerId, id, admin)
  ctx.response.status = 204
}

module.exports.startContainer = async ctx => {
  const { id, admin } = ctx.state.user
  const project = await projectService.getProject(ctx.params.id)
  await dockerService.startContainer(project.containerId, id, admin)

  ctx.response.status = 204
}

module.exports.removeContainer = async ctx => {
  const { id, admin } = ctx.state.user
  await projectService.removeProject(ctx.params.id, id, admin)
  ctx.response.status = 204
}

module.exports.authProject = async ctx => {
  const { id } = ctx.state.user
  const projects = await projectService.getProjects()
  const project = projects.filter(p => p.name === ctx.params.project)[0]

  project.author.id === id ? (ctx.status = 204) : (ctx.status = 401)
}
