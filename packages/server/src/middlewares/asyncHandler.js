// Async middleware so try/cathing isn't necessary
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
