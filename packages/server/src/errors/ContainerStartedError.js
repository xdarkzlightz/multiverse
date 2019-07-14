module.exports = class ContainerStartedError extends Error {
  constructor (data) {
    super(data)

    this.message = 'Container already started.'
    this.name = 'ContainerStartedError'
  }
}
