var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sanitizer = require('sanitizer');

var Utils = require("../Utils.js");
var errorForm = require("../Configs/ErrorForm.js").error;

var UserDb = require('../models/UserDB');
var User = mongoose.model('User');
var CaveDB = require('../models/CaveDB');
var Cave = mongoose.model('Cave');

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
    var username = sanitizer.escape(req.body.username),
        email = sanitizer.escape(req.body.email),
        password = sanitizer.escape(req.body.password),
        checkpassword = sanitizer.escape(req.body.checkpassword);

    Utils.validCreateUserForm(username, email, password, checkpassword, function(err){
        if(!err){
            var user = new User(
                {
                    username: username,
                    email: email,
                    password: password
                });
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json(errorForm[600]);
                }
                else
                    res.json({
                        success: true,
                        status: 200,
                        message: "Form successfully validate"
                    });
            });
        }else{
            res.json(err);
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

router.put('/update/username/id/:id', function(req, res, next){
    var username = sanitizer.escape(req.body.username);

    if(Utils.isValidUsername(username)){
        User.update(
            {_id: req.params.id},
            {$set:{
                username: username
            }}
        ).exec(function(err){
            if(err)
                res.json(errorForm[600]);
            else
                res.json({
                    success: true,
                    status: 200,
                    message: "Form successfully validate"
                });
        });
    }else{
        res.json(errorForm[604]);
    }
});

router.put('/update/email/id/:id', function(req, res, next){
    var email = sanitizer.escape(req.body.email);

    if(Utils.isValidEmail(email)){
        User.update(
            {_id: req.params.id},
            {$set:{
                email: email
            }}
        ).exec(function(err){
            if(err)
                res.json(errorForm[600]);
            else
                res.json({
                    success: true,
                    status: 200,
                    message: "Form successfully validate"
                });
        });
    }else{
        res.json([603]);
    }
});

router.put('/update/password/id/:id', function(req, res, next){
    var password = sanitizer.escape(req.body.password),
        checkpassword = sanitizer.escape(req.body.checkpassword);

    if(Utils.isValidPassword(password)){
        if(password == checkpassword) {
            User.update(
                {_id: req.params.id},
                {
                    $set: {
                        password: password
                    }
                }
            ).exec(function (err) {
                if (err)
                    res.json(errorForm[600]);
                else
                    res.json({
                        success: true,
                        status: 200,
                        message: "Form successfully validate"
                    });
            });
        }else{
            res.json(errorForm[607]);
        }
    }else{
        res.json(errorForm[606]);
    }
});

router.put('/update/admin/id/:id', function(req, res, next){
    var admin = sanitizer.escape(req.body.admin);

    if(admin == "true" || admin == "false"){
        User.update(
            {_id: req.params.id},
            {$set:{
                admin: (admin == "true")
            }}
        ).exec(function(err){
                if(err)
                    res.json(errorForm[600]);
                else
                    res.json({
                        success: true,
                        status: 200,
                        message: "Form successfully validate"
                    });
            });
    }else{
        res.json([600]);
    }
});

router.get('/getAllCaves/idUser/:id', function(req, res, next){
    var caves = [];
    User
        .findOne({_id: req.params.id})
        .exec(function(err, user){
            if(!err){
                for(var i = 0; i<user.caves.length; i++){
                    addUserCaves(caves, user.caves[i]);
                }
                res.json(caves);
            }

            else
                res.json({success:false});
        });
});

function addUserCaves(caves, idCave){
    Cave
    .findOne({_id:idCave})
    .exec(function(err, cave){
        if(!err)
            caves.push(cave);
    });
}

module.exports = router;
