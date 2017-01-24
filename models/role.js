//const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define("Role", {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  }, {
    tableName: 'roles', // this will define the table's name
    timestamps: true,           // this will deactivate the timestamp columns
    // updatedAt: 'updated',
    // createdAt: 'created'

    classMethods: {
      associate: function(models) {
        Role.belongsToMany(models.User, { through: 'users_roles' });
        Role.belongsToMany(models.Resource, { through: 'resources_roles' });
      }
    }
  });

  return Role;
}
