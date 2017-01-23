#!/usr/bin/env node

// =======================
// package import
// =======================
const express     = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

const cfg = require('./cfg');

const midware = require('./lib/midware')

//=======================
//routes
//=======================
var users = require('./routes/users');
//var messages = require('./routes/messages');
const auth = require('./routes/auth');

// =======================
// configuration
// =======================
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));

app.use(cookieParser());
app.use(favicon(__dirname + '/favicon.ico'));
app.use(express.static(__dirname + '/public'));
//app.use(passport.initialize());

app.use(cfg.app.api_url, auth);
// app.use(cfg.app.api_url + '/messages', messages);
app.use(cfg.app.api_url + '/users', users);

app.all('*', midware.header);

app.get('*', function(req,res){
	res.sendfile('index.html', { root: path.resolve(__dirname + '/public') });
});

//catch 404 and forward to error handler
app.use(function(req, res) {
	res.status(404).send('404: Page not Found');
});

app.use(function(error, req, res, next) {
	res.status(500).send('500: Internal Server Error %j', error);
});

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next){
	    res.status(err.status || 500);
	    res.send({
	        message: err.message,
	        error: err
	    });
	   return;
	});
}

// =======================
// start the server
// =======================

app.listen(cfg.app.port, function(){
  console.log('Express server listening on port ' + cfg.app.port);
  console.log('Now serving the app at http://localhost:' + cfg.app.port);
});
