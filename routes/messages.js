var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var _ = require('underscore');
var cfg = require('../config');
var bunyan = require('bunyan');
var log = bunyan.createLogger(_.extend(cfg.logging, {name: 'route-messages'}));

var express = require('express');
var router = express.Router();

var expressJwt = require('express-jwt');
var jwtauth = expressJwt({secret: cfg.token.secret, userProperty: cfg.token.user_property,

	fail: function (req, res, next) {
		console.log("auth failed!!!");
	      if (!req.headers.authorization) res.send(400, 'missing authorization header');
	      res.send(401);
	}
});

router.get('/cat', function(req, res, next) {
	log.debug('HTTP GET /cat -- all message');
	return res.status(200).json('calling get cat');
	});

/**
 * Only authenticated user can call api to get all messages
 */
router.get('/', jwtauth, function(req, res, next) {

	log.debug('HTTP GET /messages -- all message, req =');
	//res.status(200).json('calling get all messages');
	// 'id_ title content'
	Message.find({}).select().exec(function(err, messages) {
		if (err) {
			log.debug('HTTP GET /messages -- all message, err = %j', err);
			return res.status(500).json(err);
			//return next(err);
		}
		//console.log(messages);
		return res.status(200).json(messages);
	});
});

/**
 * create new message
 */
router.post('/', function(req, res, next) {
	log.debug('POST message= %j', req.body);
	var message = new Message(req.body);
	//message.author = req.payload.username;

	message.save(function(err, message) {
		if (err) {
			return next(err);
		}

		log.debug('saved message with id = ' + message.id)
		res.json(message);
	});
});

router.get('/:id',jwtauth, function(req, res, next) {
	var id = req.params.id;	
	log.debug('HTTP GET /messages/:id -- id = %s', id);
	
	var query = Message.findById(id);

	query.exec(function(err, message) {
		if (err) {
			return next(err);
		}
		if (!message) {
			return next(new Error("can't find message"));
		}
		
		log.debug('GET by id message= %j', message);
		res.json(message);
	});
});

router.delete('/:id', jwtauth, function(req, res, next){
	var id = req.params.id;
	var query = Message.findById(id).remove();
	
	query.exec(function(err, message) {
		if (err) {
			return next(err);
		}
		if (!message) {
			return next(new Error("can't find message"));
		}
		
		log.debug('DELETE by id message= %j', message);
		res.json(message);
	});
});

router.put('/:id', jwtauth, function(req, res, next) {
	var id = req.params.id;
	var body = req.body;
	
	delete body._id;
	
	log.debug('calling put body =%j', body);
	
	Message.findByIdAndUpdate(id, { $set: body}, function (err, message) {
		  //if (err) return handleError(err);
		if(err) return next(err);
		  res.json(message);
	});
	
	
//	var upsertData = contact.toObject();
//
//	// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
//	delete upsertData._id;
//
//	// Do the upsert, which works like this: If no Contact document exists with 
//	// _id = contact.id, then create a new doc using upsertData.
//	// Otherwise, update the existing doc with upsertData
//	Contact.update({_id: contact.id}, upsertData, {upsert: true}, function(err{...});
	
	
//	Message.findById(id, function(err, message){
//		
//		log.debug('found message in put id=%s, err =%j, msg = %j', id, err, message);
//		
//		if (err) {
//			return next(err);
//		}
//		if (!message) {
//			log.debug('find message id =%s failure', id);
//			res.status(404).json({
//				message: 'Message with id ' + id + ' can not be found.'
//			});
//			//return next(new Error("can't find message"));
//		}
//		
//		message = body;
//		message.save(function(error, status) {
//			log.debug('updated body=%j', body);
//			log.debug('updated status=%j', status);
//			
//			if(error) return next(error);
//			res.json(status);
//		});
//	});
});

module.exports = router;