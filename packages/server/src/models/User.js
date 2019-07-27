const Sequelize = require('sequelize')
const Model = Sequelize.Model

module.exports = sequelize => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'user'
    }
  )

  return User
}
