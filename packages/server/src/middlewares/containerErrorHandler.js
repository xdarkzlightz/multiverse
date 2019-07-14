module.exports = (err, req, res, next) => {
  switch (err.name) {
    case 'ContainerAccessError':
      res.status(403).send(err.message)
      break
    case 'ContainerStartedError':
      res.status(400).send(err.message)
      break
    case 'ContainerStoppedError':
      res.status(400).send(err.message)
      break
    case 'NoContainerError':
      res.status(400).send(err.message)
      break
    default:
      next(err)
  }
}
