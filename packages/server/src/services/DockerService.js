const Docker = require('dockerode')
const FriendlyError = require('../errors/FriendlyError')
const { NETWORK, BACKEND, PROJECT_HOST } = require('../config/config')

const docker = new Docker()

const getContainer = async id => {
  try {
    const container = await docker.getContainer(id)
    const data = await container.inspect()

    const {
      Config: { Labels, Image }
    } = data

    if (!Labels.multiverse || !Image === 'codercom/code-server') {
      throw new FriendlyError(
        'Unable to access container, it was not created by multiverse.'
      )
    }

    return { container, data }
  } catch (e) {
    if (e.message.includes('no such container')) {
      throw new FriendlyError('Container does not exist.')
    }
    throw e
  }
}

module.exports.getContainers = async () => {
  const containers = await docker.listContainers({
    all: true,
    filters: { label: ['multiverse=true'] }
  })

  return containers.filter(c => c.Image === 'codercom/code-server')
}

/**
 * @description Gets a container by it's id
 * @param {string} id Container id
 * @throws {FriendlyError}
 * @returns Promise<Container>
 */
module.exports.getContainer = getContainer

/**
 * @description Stops a container
 * @param {string} id Container id
 * @throws ContainerStoppedError
 * @returns Promise<void>
 */
module.exports.stopContainer = async id => {
  const { container, data } = await getContainer(id)
  if (!data.State.Running) {
    throw new FriendlyError('Container already stopped.')
  }

  await container.stop()
}

/**
 * @description Starts a container
 * @param {string} id Container id
 * @throws ContainerStartedError
 * @returns Promise<void>
 */
module.exports.startContainer = async id => {
  const { container, data } = await getContainer(id)
  if (data.State.Running) {
    throw new FriendlyError('Container already started.')
  }

  await container.start()
}

/**
 * @description Kills a container
 * @param {string} id Container id
 * @throws ContainerStoppedError
 * @returns Promise<void>
 */
module.exports.killContainer = async (id, userId, force = false) => {
  const container = await getContainer(id, userId, force)
  const data = await container.inspect()
  if (!data.State.Running) {
    throw new FriendlyError('Container already stopped.')
  }

  await container.kill()
}

/**
 * @description Removes a container
 * @param {string} id Container id
 * @throws ContainerRunningError
 * @returns Promise<void>
 */
module.exports.removeContainer = async id => {
  const { container, data } = await getContainer(id)
  if (data.State.Running) {
    throw new FriendlyError('Cannot remove a running container.')
  }

  await container.remove()
}

/**
 * @typedef {Object} Options
 * @property {string} name
 * @property {string} path
 *
 * @description Creates a container
 * @param {Options} options Container id
 * @returns Promise<Container>
 */
module.exports.createContainer = async options => {
  let { name, path, userId } = options

  const container = await docker.createContainer({
    Image: 'codercom/code-server',
    Cmd: ['--allow-http', '--no-auth'],
    Labels: {
      multiverse: 'true',
      [`traefik.backend`]: `${userId}-${name}`,
      [`traefik.frontend.rule`]: `Host:${PROJECT_HOST};PathPrefixStrip:/projects/${name}/`,
      [`traefik.frontend.port`]: '8443',
      [`traefik.docker.network`]: NETWORK,
      [`traefik.frontend.auth.forward.address`]: `http://${PROJECT_HOST}/api/containers/${name}/auth`,
      [`traefik.frontend.errors.unauthorized.backend`]: BACKEND,
      [`traefik.frontend.errors.unauthorized.query`]: '/',
      [`traefik.frontend.errors.unauthorized.status`]: '401'
    },
    HostConfig: {
      Binds: [`${path}:/home/coder/project`],
      NetworkMode: NETWORK
    }
  })

  return container
}
