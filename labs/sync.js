#!/usr/bin/env node

var Sequelize = require('sequelize')

// var sequelize = new Sequelize('lampent', 'root', 'justdoit', {
//   host: 'localhost',
//   dialect: 'mysql',
//
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 1000 //million seconds
//   },
// });

console.log(__dirname)
//var User = sequelize.import(__dirname + "../models")

var models = require('../models');
//{ force: true }
models.sequelize
  .sync({ force: true })
  .then(function(err) {
    console.log('It worked!');
  }, function (err) {
    console.log('An error occurred while creating the table:', err);
  });
