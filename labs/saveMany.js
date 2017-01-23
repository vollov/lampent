
// Demo how to save a many to many relationship
const models = require('../models');
const Promise = require("bluebird");

// find user and role in parallel
const user = models.User.findOne({username: 'dustin'});
const role = models.Role.findOne({name: 'captain'});

const joinGroup = Promise.all([user, role]);

joinGroup.then(([resUser,resRole]) => {
  resUser.setRoles([resRole]);
  return resUser.save();
  //return resUser.update({ roles: [resRole]});
})
.then((res) => {
  console.log('saved user ' + res.username);
  //console.dir(res);
})
.catch(err => console.error(err));
