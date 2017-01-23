// in your server file - e.g. app.js
//var Project = sequelize.import(__dirname + "/path/to/models/project")

// The model definition is done in /path/to/models/project.js
// As you might notice, the DataTypes are the very same as explained above
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define("Role", {
    name: DataTypes.STRING
  }, {
    tableName: 'roles', // this will define the table's name
    timestamps: true,           // this will deactivate the timestamp columns
    // updatedAt: 'updated',
    // createdAt: 'created'

    classMethods: {
      associate: function(models) {
        Role.belongsToMany(models.User, { through: 'users_roles' })
      }
    }
  });

  return Role;
}
