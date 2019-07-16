module.exports.ContainerAccessError = class ContainerAccessError extends Error {
  constructor (data) {
    super(data)

    this.message =
      'Unable to access container, it was not created by multiverse.'
    this.name = 'ContainerAccessError'
  }
}

module.exports.ContainerRunningError = class ContainerRunningError extends Error {
  constructor (data) {
    super(data)

    this.message = 'You cannot remove a running container.'
    this.name = 'ContainerRunningError'
  }
}

module.exports.ContainerStartedError = class ContainerStartedError extends Error {
  constructor (data) {
    super(data)

    this.message = 'Container already started.'
    this.name = 'ContainerStartedError'
  }
}

module.exports.ContainerStoppedError = module.exports = class ContainerStoppedError extends Error {
  constructor (data) {
    super(data)

    this.message = 'Container already stopped.'
    this.name = 'ContainerStoppedError'
  }
}

module.exports.NoContainerError = class NoContainerError extends Error {
  constructor (data) {
    super(data)

    this.message = 'Container does not exist.'
    this.name = 'NoContainerError'
  }
}
