module.exports = class NoContainerError extends Error {
  constructor (data) {
    super(data)

    this.message = 'Container does not exist.'
    this.name = 'NoContainerError'
  }
}
