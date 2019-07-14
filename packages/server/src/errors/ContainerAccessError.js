module.exports = class ContainerAccessError extends Error {
  constructor (data) {
    super(data)

    this.message =
      'Unable to access container, it was not created by multiverse.'
    this.name = 'ContainerAccessError'
  }
}
