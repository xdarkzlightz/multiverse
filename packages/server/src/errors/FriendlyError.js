module.exports = class FriendlyError extends Error {
  constructor (message, data = {}) {
    super(data)

    this.status = data.status || 400

    this.message = Array.isArray(message) ? message.join(' ') : message
  }
}
