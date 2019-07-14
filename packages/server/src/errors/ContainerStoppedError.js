module.exports = class ContainerStoppedError extends Error {
  constructor (data) {
    super(data)

    this.message = 'Container already stopped.'
    this.name = 'ContainerStoppedError'
  }
}
