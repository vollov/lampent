'use strict';
var path = require('path');

module.exports = {

	logging: {
		name: 'lampent',
		streams : [ {
			level : 'debug',
			type : 'rotating-file',
			path : path.join('.', 'logs/server.log'),
			period : '14d', // daily rotation
			count : 3 // keep 3 back copies
		} ]
	},

	test_log: {
		name: 'lampent',
		streams : [ {
			level : 'debug',
			type : 'rotating-file',
			path : path.join('.', 'logs/test.log'),
			period : '1d', // daily rotation
			count : 3 // keep 3 back copies
		} ]
	},

	token:{
		secret: 'uwotm8xxc',
		user_property: 'payload',
		age: '30m',
		exp_in_days: 1
	},

	app:{
		api_url:'/api/v1.0',
		port:3012
	}
};
