var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserDb = require('../models/UserDB');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User
      .find()
      .exec(function(err, users){
          if(!err)
            res.json(users);
      });
});

router.post('/createUser', function(req, res, next){

});

module.exports = router;
