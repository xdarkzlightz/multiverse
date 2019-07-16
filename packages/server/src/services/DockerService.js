const Docker = require('dockerode')
const {
  ContainerAccessError,
  ContainerRunningError,
  ContainerStartedError,
  ContainerStoppedError,
  NoContainerError
} = require('../errors/ContainerErrors')

const docker = new Docker()

/**
 * @class
 * @description Docker service for managing code-server containers
 */
module.exports = class DockerService {
  /**
   * @description Gets an array of containers
   * @returns Promise<Array[Container]>
   */
  async getContainers () {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ['multiverse=true'] }
    })

    return containers.filter(c => c.Image === 'codercom/code-server')
  }

  /**
   * @description Gets a container by it's id
   * @param {string} id Container id
   * @throws ContainerAccessError
   * @throws NoContainerError
   * @returns Promise<Container>
   */
  async getContainer (id) {
    try {
      const container = await docker.getContainer(id)
      const {
        Config: { Labels, Image }
      } = await container.inspect()

      if (!Labels.multiverse || !Image === 'codercom/code-server') {
        throw new ContainerAccessError()
      }

      return container
    } catch (e) {
      if (e.message.includes('no such container')) throw new NoContainerError()
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
    if (!data.State.Running) throw new ContainerStoppedError()

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
    if (data.State.Running) throw new ContainerStartedError()

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
    if (!data.State.Running) throw new ContainerStoppedError()

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
    if (data.State.Running) throw new ContainerRunningError()

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
    let { name, password, port, path, ports, volumes, http, auth } = options
    const [host, cont] = [port[0].toString(), port[1].toString()]
    ports = ports || []
    const ExposedPorts = { [cont]: {} }
    const PortBindings = { [cont]: [{ HostPort: host }] }
    ports.forEach(p => {
      const [host, cont] = [p[0].toString(), p[1].toString()]
      ExposedPorts[cont] = {}
      PortBindings[cont] = [{ HostPort: host }]
    })

    const container = await docker.createContainer({
      Image: 'codercom/code-server',
      Env: [`PORT=${cont}`, `PASSWORD=${password}`],
      Entrypoint: [
        'dumb-init',
        'code-server',
        http ? '--allow-http' : '',
        auth ? '' : '--no-auth'
      ],
      ExposedPorts,
      Labels: {
        multiverse: 'true',
        [`multiverse.port`]: host,
        [`multiverse.project`]: name
      },
      HostConfig: {
        PortBindings,
        Binds: [`${path}:/home/coder/project`, ...volumes]
      }
    })

    return container
  }
}
