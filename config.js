'use strict';
var path = require('path');

module.exports = {
	
	logging: {
		name: 'berly',
		streams : [ {
			level : 'debug',
			type : 'rotating-file',
			path : path.join('.', 'logs/server.log'),
			period : '14d', // daily rotation
			count : 3 // keep 3 back copies
		} ]
	},
	
	test_log: {
		name: 'berly',
		streams : [ {
			level : 'debug',
			type : 'rotating-file',
			path : path.join('.', 'logs/test.log'),
			period : '1d', // daily rotation
			count : 3 // keep 3 back copies
		} ]
	},
		
	test:{
		url : 'http://localhost:8000'
	},
	
	test_db:{
		host: 'localhost',
		name: 'beryl_test',
		port: '27017',
	},
	
	db:{
		host: 'localhost',
		name: 'beryl',
		port: '27017',
	},
	
	token:{
		secret: 'uwotm8xxc',
		user_property: 'payload', 
		age: '30m'
	},
	
	app:{
		api_url:'/api/v1.0',
		port:8000
	}
};