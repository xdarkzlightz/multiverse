const app = require('./app')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log('Multiverse is running on port ' + PORT)
})
