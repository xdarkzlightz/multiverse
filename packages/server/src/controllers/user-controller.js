const UserService = require('../services/UserService')

const userService = new UserService()

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

  ctx.status = 204
}

module.exports.updateUser = async ctx => {
  await userService.updateUser(ctx.params.id, ctx.request.body)
  ctx.status = 204
}
