
"use strict";
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const cfg = require('../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));


module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    hash: {
      type:DataTypes.STRING,
    },
    salt: {
      type:DataTypes.STRING,
    },
    number: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0, max: 200 }
    },
    birthYear: {
      type: DataTypes.INTEGER,
      defaultValue: 1970,
      validate: { min: 1950, max: 2075 }
    },
    status:{
      type: DataTypes.ENUM,
      values: ['active', 'pending', 'free'],
      defaultValue: 'free'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users',

    classMethods: {
      associate: function(models) {
        //User.belongsTo(models.Role)
        User.belongsToMany(models.Role, { through: 'users_roles' });
      }
    },

    instanceMethods: {
      // Generate JWT token
      generateJWT: function() {
        log.debug('user %s generateJWT()...', this.username);

        return jwt.sign({
          username : this.username
        }, cfg.token.secret, {expiresIn: cfg.token.age});
      },

      // mask plain text password into hash and salt string
      setPassword : function(password) {
      	this.salt = crypto.randomBytes(16).toString('hex');
        //  crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
        // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_
        // salt_iterations_keylen_digest_callback
      	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64)
      			.toString('hex');
      },

      // verify the password is correct
      validPassword : function(password) {
      	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
      	return this.hash === hash;
      }
    }
  });

  return User;
}
