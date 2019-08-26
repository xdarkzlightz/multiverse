const userService = require('../services/UserService')

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
    user.id = user._id
    delete user.password
    delete user._id
    return user
  })

  ctx.status = 200
}

module.exports.getUser = async ctx => {
  const user = await userService.getUserById(ctx.params.id)
  const response = user.toJSON()
  response.id = response._id
  delete response.password
  delete response._id

  ctx.body = response

  ctx.status = 200
}

module.exports.deleteUser = async ctx => {
  await userService.deleteUser(ctx.params.id)
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
