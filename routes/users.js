const express = require('express');
const router = express.Router();

const cfg = require('../cfg');
const _ = require('underscore');
const bunyan = require('bunyan');
const log = bunyan.createLogger(_.extend(cfg.logging, {name: 'user'}));

const models = require('../models');

/* GET users listing. */
router.get('/', function(req, res) {
	console.log('calling get users');

	models.User.findAll({
		include: [ { model: models.Role,
			attributes: ['name']
		}],
		attributes: [
		'username',
		'email',
		'number',
		'birthYear',
		'status']
	})
	.then((users) => {
		return res.status(200).json(users);
	})
	.catch((err) => {
		log.error('encountered database error when get all users %j', err);
		return res.status(500).json({
			message : 'database error when getting users'
		});
	});
  //res.send('respond with a resource');
});

router.get('/cat', function(req, res, next) {
	log.debug('HTTP GET /cat -- all message');
	return res.status(200).json('calling get cat');
});

module.exports = router;
