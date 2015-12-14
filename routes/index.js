var express = require('express');
var router = express.Router();
var Cookies = require("cookies");
var jwt = require('jsonwebtoken');
var config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  var token = new Cookies(req, res).get('token');
  var user = jwt.decode(token, config.secret);
  res.render('index', { title: 'Express', user: user});
});

module.exports = router;
