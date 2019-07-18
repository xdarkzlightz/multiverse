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
  async getContainer (id) {
    try {
      const container = await this.docker.getContainer(id)
      const {
        Config: { Labels, Image }
      } = await container.inspect()

      if (!Labels.multiverse || !Image === 'codercom/code-server') {
        throw new FriendlyError(
          'Unable to access container, it was not created by multiverse.'
        )
      }

      return container
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
  async stopContainer (id) {
    const container = await this.getContainer(id)
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
  async startContainer (id) {
    const container = await this.getContainer(id)
    const data = await container.inspect()
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
  async killContainer (id) {
    const container = await this.getContainer(id)
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
  async removeContainer (id) {
    const container = await this.getContainer(id)
    const data = await container.inspect()
    if (data.State.Running) {
      throw new FriendlyError('Cannot remove a running container.')
    }

    await container.remove()
  }

  /**
   * @typedef {Object} Options
   * @property {string} name
   * @property {string} password
   * @property {[number]} port
   * @property {string} path
   * @property {[[number]]} ports
   * @property {[[string]]} volumes
   * @property {boolean} http
   * @property {auth} auth
   *
   * @description Creates a container
   * @param {Options} options Container id
   * @returns Promise<Container>
   */
  async createContainer (options) {
    let { name, path, http, auth } = options
    const ExposedPorts = { '8443': {} }
    const PortBindings = { '8443': [{ HostPort: '8443' }] }

    const container = await this.docker.createContainer({
      Image: 'codercom/code-server',
      Entrypoint: [
        'dumb-init',
        'code-server',
        http ? '--allow-http' : '',
        auth ? '' : '--no-auth'
      ],
      ExposedPorts,
      Labels: {
        multiverse: 'true',
        [`multiverse.port`]: '8443',
        [`multiverse.project`]: name
      },
      HostConfig: {
        PortBindings,
        Binds: [`${path}:/home/coder/project`]
      }
    })

    return container
  }
}
