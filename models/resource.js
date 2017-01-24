const cfg = require('../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'resource'}));


module.exports = function(sequelize, DataTypes) {
  var Resource = sequelize.define("Resource", {
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    uri: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    action: {
      type: DataTypes.ENUM,
      values: ['PUT', 'GET', 'POST','DELETE'],
      defaultValue: 'GET'
    }
  },{
    tableName: 'resources',

    classMethods: {
      associate: function(models) {
        Resource.belongsToMany(models.Role, { through: 'resources_roles' });
      }
    }
  });

  return Resource;
}
