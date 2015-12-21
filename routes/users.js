var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sanitizer = require('sanitizer');

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
    var regExEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    var emailMatch;
    var username = sanitizer.escape(req.body.username),
        email = sanitizer.escape(req.body.email),
        password = sanitizer.escape(req.body.password),
        checkpassword = sanitizer.escape(req.body.checkpassword);

    User.findOne({ $or:[ {username:username}, {email:email} ]})
        .exec(function(err, user){
            if(!user){
                if(password == checkpassword){
                    if( (emailMatch = email.match(regExEmail)) ){
                        var user = new User(
                            {
                                username: username,
                                email: email,
                                password: password
                            });
                        user.save(function(err){
                            if(err) {
                                console.log(err);
                                res.json({success: false});
                            }
                            else
                                res.json({success: true});
                        });
                    }else{
                        res.json({
                            success: false,
                            status: 602,
                            message: "The email address is not valid"
                        });
                    }
                }else{
                    res.json({
                        success: false,
                        status: 601,
                        message: "The two passwords doesn't match"
                    });
                }
            }else{
                if(user.username == username){
                    res.json({
                        success: false,
                        status: 603,
                        message: "The username is already used"
                    });
                }else if(user.email == email){
                    res.json({
                        success: false,
                        status: 604,
                        message: "The email address is already used"
                    });
                }
            }
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
