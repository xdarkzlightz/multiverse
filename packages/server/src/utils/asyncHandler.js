// Async middleware so I don't have to try/catch async functions
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
