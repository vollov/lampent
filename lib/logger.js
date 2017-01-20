'use strict';

var cfg = require('../config.js');
var path = require('path');
var bunyan = require('bunyan');

module.exports = function() {
	// type log\foo.log | node_modules\.bin\bunyan
	return {
		getLogger : function() {
			var logger = bunyan.createLogger({
				name : cfg.app.name,
				streams : [ {
					level : 'debug'
					type : 'rotating-file',
					path : path.join(cfg.app.root, 'logs/server.log'),
					period : '1d', // daily rotation
					count : 3 // keep 3 back copies
				} ]
			});
			return logger;
		}
	}
}