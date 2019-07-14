const Docker = require('dockerode')
const ContainerAccessError = require('../errors/ContainerAccessError')
const ContainerStoppedError = require('../errors/ContainerStoppedError')
const ContainerStartedError = require('../errors/ContainerStartedError')

const docker = new Docker()

module.exports = class DockerService {
  async getContainers () {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ['multiverse=true'] }
    })

    return containers.filter(c => c.Image === 'codercom/code-server')
  }

  async getContainer (id) {
    const container = await docker.getContainer(id)
    const {
      Config: { Labels, Image }
    } = await container.inspect()

    if (!Labels.multiverse || !Image === 'codercom/code-server') {
      throw new ContainerAccessError()
    }

    return container
  }

  async stopContainer (id) {
    const container = await this.getContainer(id)
    const data = await container.inspect()
    if (!data.State.Running) throw new ContainerStoppedError()

    await container.stop()
  }

  async startContainer (id) {
    const container = await this.getContainer(id)
    const data = await container.inspect()
    if (data.State.Running) throw new ContainerStartedError()

    await container.start()
  }

  async killContainer (id) {
    const container = await this.getContainer(id)
    const data = await container.inspect()
    if (!data.State.Running) throw new ContainerStoppedError()

    await container.kill()
  }

  async removeContainer (id) {
    const container = await this.getContainer(id)
    await container.remove()
  }

  async createContainer (options) {
    const { name, password, port, path, ports, volumes, http, auth } = options
    const [host, cont] = port.split(':')
    const ExposedPorts = { [cont]: {} }
    const PortBindings = { [cont]: [{ HostPort: host }] }
    ports.forEach(p => {
      const [host, cont] = p.split(':')
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
