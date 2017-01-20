var sequelize = new Sequelize('lampent', 'root', 'justdoit', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'path/to/database.sqlite'
});

module.exports.db = sequelize;