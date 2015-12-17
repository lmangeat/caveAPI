var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var Cookies = require("cookies");
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var config = require('./config.json');
var Utils = require("./Utils.js");

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

//var http_port = process.env.HTTP_PORT || 3000;

console.log("Starting application");
console.log("Loading Mongoose functionality");
mongoose.set('debug', true);
mongoose.connect("mongodb://root:root@ds027495.mongolab.com:27495/caveapi");
mongoose.connection.on('error', function () {
  console.log('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
  console.log("Mongoose connected to the database");
});

var app = express();

app.use(function (req, res, next) {
  var token = new Cookies(req, res).get('token');
  if(Utils.isDisconnectedLink(req.url) || req.url == '/'){
    next();
  }else{
    if(token){
      jwt.verify(token, config.pwd.secret, function(err, decoded) {
        if(err)
          res.send("Connected required link");
        else
        if(Utils.isAdminRequiredLink(req.url) && decoded.admin == false)
          res.send("Admin required link");
        else
          next();
      });
    }else{
      res.send("Connected required link");
    }
  }
});

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//port configuration for commande "node app.js"
app.set('port', 3000);
app.listen(3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    /*
    res.json({
      message: err.message,
      status: err.status || 500,
      stack: err.stack
    });*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  /*
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });*/
  res.json({
    message: err.message,
    status: err.status || 500
  });
});

/*
console.log("Creating HTTP server on port: %s", http_port);
require('http').createServer(app).listen(http_port, function () {
  console.log("HTTP Server listening on port: %s, in %s mode", http_port, app.get('env'));
});
*/

module.exports = app;
