'use strict';

var logger = require('log4js').getLogger('controller.user'),
    mongoose = require('mongoose'),
    sanitizer = require('sanitizer'),
    _ = require('lodash'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    Util = require('./utils/util.js'),
    errorForm = require("../config/ErrorForm.js").error,
    config = require('../config/config.json'),
    UserDB = require('../models/UserDB'),
    User = mongoose.model('User'),
    CaveDB = require('../models/CaveDB'),
    Cave = mongoose.model('Cave');

//REST: GET /users
module.exports.getUsers = function getUsers(req, res, next) {
    //TODO add size param handling => see how to get the query params (using url package ?)
    // Code necessary to consume the User API and respond
    logger.info('Getting all users from db...');
    User.find({})
        //.limit(size)
        .exec(function (err, users) {
            if (err)
                return next(err.message);

            if (_.isNull(users) || _.isEmpty(users)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't gets users"}, null, 2));
            }
            else {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(users || {}, null, 2));
            }
        });
};

//REST: GET /users/getOne/username/{username}
module.exports.getUserByUserName = function getUserByUserName(req, res, next){
    User.find({username: Util.getPathParams(req)[3]})
        .exec(function(err, users){
            if (err)
                return next(err.message);

            if (_.isNull(users) || _.isEmpty(users)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't gets user"}, null, 2));
            }
            else {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(users[0] || {}, null, 2));
            }
        });
};

//REST: GET /users/getOne/email/{email}
module.exports.getUserByEmail = function getUserByEmail(req, res, next){
    User.find({email: Util.getPathParams(req)[3]})
        .exec(function(err, users){
            if (err)
                return next(err.message);

            if (_.isNull(users) || _.isEmpty(users)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't gets user"}, null, 2));
            }
            else {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(users[0] || {}, null, 2));
            }
        });
};

//REST: POST /users/create
module.exports.createUser = function createUser(req, res, next){
    var username = sanitizer.escape(req.body.username),
        email = sanitizer.escape(req.body.email),
        password = sanitizer.escape(req.body.password),
        checkpassword = sanitizer.escape(req.body.checkpassword);

    Util.validCreateUserForm(username, email, password, checkpassword, function(err){
        if(!err){
            var user = new User(
                {
                    username: username,
                    email: email,
                    password: password
                });
            user.save(function (err, user) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
                }
                else{
                    res.set('Content-Type', 'application/json');
                    res.end(JSON.stringify(user || {}, null, 2));
                }
            });
        }else{
            res.set('Content-Type', 'application/json');
            res.status(err.status).json(JSON.stringify({error: err.message}, null, 2));
        }
    });
};

//REST: DELETE /users/delete/username/{username}
module.exports.deleteByUserName = function deleteByUserName(req, res, next){
    User.remove({username: Util.getPathParams(req)[3]})
        .exec(function(err, user){
            res.set('Content-Type', 'application/json');
            res.end(JSON.stringify(user || {}, null, 2));
        });
};

//REST: DELETE /users/delete/email/{email}
module.exports.deleteByEmail = function deleteByEmail(req, res, next){
    User.remove({email: Util.getPathParams(req)[3]})
        .exec(function(err, user){
            res.set('Content-Type', 'application/json');
            res.end(JSON.stringify(user || {}, null, 2));
        });
};

//REST: DELETE /users/delete/id/{id}
module.exports.deleteById = function deleteById(req, res, next){
    User.remove({_id: Util.getPathParams(req)[3]})
        .exec(function(err, user){
            res.set('Content-Type', 'application/json');
            res.end(JSON.stringify(user || {}, null, 2));
        });
};

//REST: PUT /users/update/username/id/{id}
module.exports.updateUsername = function updateUsername(req, res, next){
    var username = sanitizer.escape(req.body.username);

    if(Util.isValidUsername(username)){
        User.update(
            {_id: Util.getPathParams(req)[4]},
            {$set:{
                username: username
            }}
        ).exec(function(err, user){
            if(err){
                res.set('Content-Type', 'application/json');
                res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
            }
            else{
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(user || {}, null, 2));
            }
        });
    }else{
        res.set('Content-Type', 'application/json');
        res.status(604).json(JSON.stringify({error: errorForm[604].message}, null, 2));
    }
};

//REST: PUT /users/update/email/id/{id}
module.exports.updateEmail = function updateEmail(req, res, next){
    var email = sanitizer.escape(req.body.email);

    if(Util.isValidEmail(email)){
        User.update(
            {_id: Util.getPathParams(req)[4]},
            {$set:{
                email: email
            }}
        ).exec(function(err, user){
            if(err){
                res.set('Content-Type', 'application/json');
                res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
            }
            else{
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(user || {}, null, 2));
            }
        });
    }else{
        res.set('Content-Type', 'application/json');
        res.status(604).json(JSON.stringify({error: errorForm[604].message}, null, 2));
    }
};

//REST: PUT /users/update/password/id/{id}
module.exports.updatePassword = function updatePassword(req, res, next){
    var password = sanitizer.escape(req.body.password),
        checkpassword = sanitizer.escape(req.body.checkpassword);

    if(Utils.isValidPassword(password)){
        if(password == checkpassword) {
            User.update(
                {_id: Util.getPathParams(req)[4]},
                {
                    $set: {
                        password: password
                    }
                }
            ).exec(function (err, user) {
                if (err){
                    res.set('Content-Type', 'application/json');
                    res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
                }
                else{
                    res.set('Content-Type', 'application/json');
                    res.end(JSON.stringify(user || {}, null, 2));
                }
            });
        }else{
            res.set('Content-Type', 'application/json');
            res.status(607).json(JSON.stringify({error: errorForm[607].message}, null, 2));
        }
    }else{
        res.set('Content-Type', 'application/json');
        res.status(606).json(JSON.stringify({error: errorForm[606].message}, null, 2));
    }
};

//REST: PUT /users/update/admin/id/{id}
module.exports.updateAdmin = function updateAdmin(req, res, next){
    var admin = sanitizer.escape(req.body.admin);

    if(admin == "true" || admin == "false"){
        User.update(
            {_id: Util.getPathParams(req)[4]},
            {$set:{
                admin: (admin == "true")
            }}
        ).exec(function(err, user){
            if(err){
                res.set('Content-Type', 'application/json');
                res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
            }
            else{
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(user || {}, null, 2));
            }
        });
    }else{
        res.set('Content-Type', 'application/json');
        res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
    }
};

//REST: GET /users/caves/idUser/{id}
module.exports.getAllCaves = function getAllCaves(req, res, next){
    User.findOne({_id: Util.getPathParams(req)[3]})
        .populate('caves')
        .exec(function(err, user){
            if(!err){
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(user.caves || {}, null, 2));
            }
            else{
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't gets user's caves"}, null, 2));
            }
        });
};
