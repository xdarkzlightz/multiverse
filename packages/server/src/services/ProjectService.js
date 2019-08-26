const dockerService = require('./DockerService')
const Project = require('../models/Project')

module.exports.createProject = async (userId, { name, path }) => {
  const container = await dockerService.createContainer({ name, path, userId })
  const project = new Project({
    name,
    containerId: container.id,
    author: userId
  })
  await project.save()
  return project
}

module.exports.getProject = async id => {
  const project = await Project.findById(id).populate('author')
  const container = await dockerService.getContainer(project.containerId)

  return { ...project.toObject(), container }
}

module.exports.getProjects = async () => {
  const projects = await Project.find().populate('author')
  const promises = []
  projects.forEach(p => {
    const getProject = async () => {
      const container = await dockerService.getContainer(p.containerId)
      return { ...p.toObject(), container }
    }
    promises.push(getProject())
  })

  return Promise.all(promises)
}

module.exports.removeProject = async id => {
  const project = await Project.findByIdAndDelete(id)
  await dockerService.removeContainer(project.containerId)
}

module.exports.updateProject = (id, data) => {
  throw new Error('Not Implemented')
}
