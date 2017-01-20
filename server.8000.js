#!/usr/bin/env node

// =======================
// package import
// =======================
var express     = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();





var cfg = require('./config');

require('./models/Users');
require('./models/Messages');

//=======================
//routes 
//=======================
//var routes = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var auth = require('./routes/auth');

//connect MongoDB
mongoose.connect('mongodb://localhost/'+ cfg.db.name, function(err,db){
    if (!err){
        console.log('Connected to db: ' + cfg.db.name);
    } else{
        console.dir(err); //failed to connect
    }
});


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
app.use(cfg.app.api_url + '/messages', messages);
app.use(cfg.app.api_url + '/users', users);

app.get('*', function(req,res){
	res.sendfile('index.html', { root: path.resolve(__dirname + '/public') });
});

//catch 404 and forward to error handler
app.use(function(req, res) {
	res.status(404).send('404: Page not Found');
});

app.use(function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error');
 });

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}



// =======================
// start the server 
// =======================

app.listen(cfg.app.port, function(){
  console.log('Express server listening on port ' + cfg.app.port);
  console.log('Now serving the app at http://localhost:' + cfg.app.port);
});
