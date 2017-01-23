var sequelize = new Sequelize('lampent', 'root', 'justdoit', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

module.exports.db = sequelize;
