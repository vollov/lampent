#!/usr/bin/env node

var Sequelize = require('sequelize')

var sequelize = new Sequelize('lampent', 'root', 'justdoit', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 1000 //million seconds
  },
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function (err) {
    console.log('Unable to connect to the database:', err);
  });
