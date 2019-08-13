const Docker = require('dockerode')
const FriendlyError = require('../errors/FriendlyError')

/**
 * @class
 * @description Docker service for managing code-server containers
 */
module.exports = class DockerService {
  constructor () {
    this.docker = new Docker()
  }

  /**
   * @description Gets an array of containers
   * @returns Promise<Array[Container]>
   */
  async getContainers () {
    const containers = await this.docker.listContainers({
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
  async getContainer (id, userId, force = false, inspect = false) {
    try {
      const container = await this.docker.getContainer(id)
      const data = await container.inspect()
      const {
        Config: { Labels, Image }
      } = data

      if (!Labels.multiverse || !Image === 'codercom/code-server') {
        throw new FriendlyError(
          'Unable to access container, it was not created by multiverse.'
        )
      }

      if (!force && Labels['multiverse.userId'] !== userId) {
        throw new FriendlyError('Unauthorized', { status: 401 })
      }

      return inspect ? data : container
    } catch (e) {
      if (e.message.includes('no such container')) {
        throw new FriendlyError('Container does not exist.')
      }
      throw e
    }
  }

  /**
   * @description Stops a container
   * @param {string} id Container id
   * @throws ContainerStoppedError
   * @returns Promise<void>
   */
  async stopContainer (id, userId, force = false) {
    const container = await this.getContainer(id, userId, force)
    const data = await container.inspect()
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
  async startContainer (id, userId, force = false) {
    const container = await this.getContainer(id, userId, force)
    const data = await container.inspect()
    if (data.State.Running) {
      throw new FriendlyError('Container already started.')
    }

    console.log('?')

    await container.start()
  }

  /**
   * @description Kills a container
   * @param {string} id Container id
   * @throws ContainerStoppedError
   * @returns Promise<void>
   */
  async killContainer (id, userId, force = false) {
    const container = await this.getContainer(id, userId, force)
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
  async removeContainer (id, userId, force = false) {
    const container = await this.getContainer(id, userId, force)
    const data = await container.inspect()
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
  async createContainer (options) {
    let { name, path, userId } = options

    const MULTIVERSE_PROJECT_HOST = process.env.MULTIVERSE_PROJECT_HOST
    const MULTIVERSE_PROJECT_NETWORK = process.env.MULTIVERSE_PROJECT_NETWORK
    const MULTIVERSE_BACKEND = process.env.MULTIVERSE_BACKEND

    const container = await this.docker.createContainer({
      Image: 'codercom/code-server',
      Cmd: ['--allow-http', '--no-auth'],
      Labels: {
        multiverse: 'true',
        [`multiverse.port`]: '8443',
        [`multiverse.project`]: name,
        [`multiverse.userId`]: userId,
        [`traefik.backend`]: `${userId}-${name}`,
        [`traefik.frontend.rule`]: `Host:${MULTIVERSE_PROJECT_HOST};PathPrefixStrip:/projects/${name}/`,
        [`traefik.frontend.port`]: '8443',
        [`traefik.docker.network`]: MULTIVERSE_PROJECT_NETWORK,
        [`traefik.frontend.auth.forward.address`]: `http://${MULTIVERSE_PROJECT_HOST}/api/containers/${name}/auth`,
        [`traefik.frontend.errors.unauthorized.backend`]: MULTIVERSE_BACKEND,
        [`traefik.frontend.errors.unauthorized.query`]: '/',
        [`traefik.frontend.errors.unauthorized.status`]: '401'
      },
      HostConfig: {
        Binds: [`${path}:/home/coder/project`],
        NetworkMode: MULTIVERSE_PROJECT_NETWORK
      }
    })

    return container
  }
}
