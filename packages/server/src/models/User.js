const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    username: String,
    password: String,
    admin: Boolean,
    projects: [{ type: Schema.Types.ObjectId, Ref: 'Project' }]
  },
  {
    timestamps: {}
  }
)

module.exports = mongoose.model('User', User)
