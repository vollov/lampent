var Sequelize = require('sequelize')
var models = require('../models');

//var User = sequelize.import(__dirname + "../models/user")

// var user = models.User.build({
//   username: 'dustin',
//   email: 'dustin@ocbl.ca',
//   password: 'whatsup',
//   active: true
// });
//
// user.save().then(function() {
//   console.log('saved user ' + user.username);
// })

var role = {
  name: 'captain'
}

models.Role.create(role)
.then(function(role){
  console.log('saved role ' + role.name);
})

var user = {
  username: 'dustin',
  email: 'dustin@ocbl.ca',
  number: 11,
  birthYear: 1979,
  active: true
}

models.User.create(user)
.then(function(user){
  console.log('saved user ' + user.username);
})
