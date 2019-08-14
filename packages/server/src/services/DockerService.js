const Sequelize = require('sequelize')
const Docker = require('dockerode')
const join = require('path').join
const logger = require('../utils/winston')
const FriendlyError = require('../errors/FriendlyError')
const Project = require('../models/Project')

/**
 * @class
 * @description Docker service for managing code-server containers
 */
module.exports = class DockerService {
  constructor () {
    this.docker = new Docker()
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: join(process.cwd(), '/users.sqlite3'),
      logging: msg => logger.debug(msg)
    })
    this.project = Project(this.sequelize)
    this.connection = false
  }

  async connect () {
    if (this.connection) return
    await this.sequelize.authenticate()
    logger.debug('Connected to sqlite database')

    this.connection = true

    await this.project.sync()
    logger.debug('Synchronised project model')
  }

  /**
   * @description Gets an array of containers
   * @returns Promise<Array[Container]>
   */
  async getContainers () {
    await this.connect()
    const containers = await this.docker.listContainers({
      all: true,
      filters: { label: ['multiverse=true'] }
    })
    const projects = await this.project.findAll()

    return {
      containers: containers.filter(c => c.Image === 'codercom/code-server'),
      projects
    }
  }

  /**
   * @description Gets a container by it's id
   * @param {string} id Container id
   * @throws {FriendlyError}
   * @returns Promise<Container>
   */
  async getContainer (id, userId, force = false, inspect = false) {
    try {
      await this.connect()
      const container = await this.docker.getContainer(id)
      const data = await container.inspect()
      const project = await this.project.findOne({ where: { containerId: id } })

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

      return inspect ? { data, project } : { container, project }
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
    await this.connect()
    const { container, project } = await this.getContainer(id, userId, force)
    const data = await container.inspect()
    if (data.State.Running) {
      throw new FriendlyError('Cannot remove a running container.')
    }

    await container.remove()
    if (project) await project.destroy()
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
    await this.connect()
    let { name, path, userId } = options

    const MULTIVERSE_PROJECT_HOST = process.env.MULTIVERSE_PROJECT_HOST
    const MULTIVERSE_PROJECT_NETWORK = process.env.MULTIVERSE_PROJECT_NETWORK
    const MULTIVERSE_BACKEND = process.env.MULTIVERSE_BACKEND

    const container = await this.docker.createContainer({
      Image: 'codercom/code-server',
      Cmd: ['--allow-http', '--no-auth'],
      Labels: {
        multiverse: 'true',
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

    const info = await this.project.create({
      name,
      containerId: container.id,
      userId
    })

    return { container, info }
  }
}
