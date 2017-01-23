const express = require('express');
const router = express.Router();

const models = require('../models');
const Promise = require("bluebird");

const _ = require('underscore');
const cfg = require('../cfg');
const bunyan = require('bunyan');

const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'auth'}));

router.post('/register', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({
			message : 'username required'
		});
	}

	if (!req.body.password) {
		return res.status(400).json({
			message : 'password required'
		});
	}

	var u = req.body;

	// create user, default not activated:
	models.User.create(req.body)
	.then((user) => {
		return res.status(200).json({ token: user.generateJWT()});
	}).catch((err) => {
		log.error('encountered database error when save user %s in registration', req.body.username);
		return res.status(500).json({
			message : 'registration error when saving new user'
		});
	})
});

router.post('/login', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({
			message : 'username required'
		});
	}

	if (!req.body.password) {
		return res.status(400).json({
			message : 'password required'
		});
	}

	models.User.findOne({username : req.body.username})
	.then((user) => {
		if (!user) {
			return res.status(401).json({
				message : 'login a non-existing user'
			});
		}

		if (!user.validPassword(req.body.password)) {
			return res.status(401).json({
				message : 'Incorrect password.'
			});
		}

		return res.status(200).json({
			token : user.generateJWT()
		})
	})
	.catch((err) => {
		log.error('encountered database error when login user %s', req.body.username);
		return res.status(500).json({
			message : 'login error when find user by username'
		});
	});

});

module.exports = router;
