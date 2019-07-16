module.exports = (err, req, res, next) => {
  if (err.error && err.error.isJoi) {
    res.status(400).send(err.error.details.map(({ message }) => message))
  } else {
    next(err)
  }
}
