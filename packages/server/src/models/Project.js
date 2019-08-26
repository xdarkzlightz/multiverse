const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema({
  name: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  containerId: String
})

module.exports = mongoose.model('Project', Project)
