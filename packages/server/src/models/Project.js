const Sequelize = require('sequelize')
const Model = Sequelize.Model

module.exports = sequelize => {
  class Project extends Model {}
  Project.init(
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      containerId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'project'
    }
  )

  return Project
}
