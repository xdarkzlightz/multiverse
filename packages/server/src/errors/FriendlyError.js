module.exports = class FriendlyError extends Error {
  constructor (message, data) {
    super(data)

    this.status = 400

    if (Array.isArray(message)) {
      let msg = ''
      message.forEach(_msg => (msg += _msg))
      this.message = msg
    } else {
      this.message = message
    }
  }
}
