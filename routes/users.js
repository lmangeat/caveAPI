var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserDb = require('../models/UserDB');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/getAll', function(req, res, next) {
  User
      .find()
      .exec(function(err, users){
          if(!err)
            res.json(users);
      });
});

router.get('/getOne/username/:username', function(req, res, next) {
    User
        .find({username: req.param.username})
        .exec(function(err, users){
            if(!err)
                res.json(users);
        });
});

router.get('/getOne/email/:email', function(req, res, next) {
    User
        .find({email: req.param.email})
        .exec(function(err, users){
            if(!err)
                res.json(users);
        });
});

router.post('/create', function(req, res, next){
    var user = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
    user.save(function(err){
        if(err) {
            console.log(err);
            res.json({success: false});
        }
        else
            res.json({success: true});
    });
});

router.delete('/delete/username/:username', function(req, res, next){
    User
        .remove({username: req.params.username})
        .exec(function(err, user){
            res.json(user);
        });
});

router.delete('/delete/email/:email', function(req, res, next){
    User
        .remove({email: req.params.email})
        .exec(function(err, user){
            res.json(user);
        });
});

router.delete('/delete/id/:id', function(req, res, next){
    User
        .remove({_id: req.params.id})
        .exec(function(err, user){
            res.json(user);
        });
});

router.put('/update', function(req, res, next){

});

module.exports = router;
