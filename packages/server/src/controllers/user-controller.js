const UserService = require('../services/UserService')
const logger = require('../utils/winston')
const DockerService = require('../services/DockerService')

const userService = new UserService()
const dockerService = new DockerService()

module.exports.createUser = async ctx => {
  const user = await userService.createUser(ctx.request.body)

  ctx.body = {
    id: user.id
  }

  ctx.status = 201
}

module.exports.getUsers = async ctx => {
  const users = await userService.getUsers()

  ctx.body = users.map(u => {
    const user = u.toJSON()
    delete user.password
    return user
  })

  ctx.status = 200
}

module.exports.getUser = async ctx => {
  const user = await userService.getUserById(ctx.params.id)

  const response = user.toJSON()

  delete response.password

  ctx.body = response

  ctx.status = 200
}

module.exports.deleteUser = async ctx => {
  await userService.deleteUser(ctx.params.id)

  let containers = await dockerService.getContainers()
  containers = containers.filter(
    c => c.Labels['multiverse.userId'] === ctx.params.id
  )

  const promises = []
  containers.forEach(c => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (c.State === 'running') {
          await dockerService.stopContainer(c.Id, ctx.params.id, true)
        }

        await dockerService.removeContainer(c.Id, ctx.params.id, true)
        logger.info('removed container')
        resolve()
      } catch (e) {
        reject(e)
      }
    })

    promises.push(promise)
  })

  await Promise.all(promises)

  ctx.status = 204
}

module.exports.updateUser = async ctx => {
  await userService.updateUser(
    ctx.params.id,
    ctx.request.body,
    ctx.state.user.id
  )
  ctx.status = 204
}

module.exports.resetPassword = async ctx => {
  await userService.resetPassword(
    ctx.params.id,
    ctx.request.body.password,
    ctx.state.user.id
  )
  ctx.status = 204
}

module.exports.updatePassword = async ctx => {
  const { oldPassword, newPassword } = ctx.request.body
  await userService.updatePassword(
    ctx.params.id,
    oldPassword,
    newPassword,
    ctx.state.user.id
  )
  ctx.status = 204
}
