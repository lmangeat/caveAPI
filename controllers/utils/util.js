"use strict";

var url = require('url'),
    express = require('express'),
    logger = require('log4js').getLogger('controller.util'),
    config = require('../../config/config.json'),
    errorForm = require("../../config/ErrorForm.js").error,
    mongoose = require('mongoose');

var UserDb = require('../../models/UserDB');
var User = mongoose.model('User');


function isValidPassword(password){
    return (password.length >= 4);
}

function isValidUsername(username){
    return (username.length >= 4);
}

function isValidEmail(email){
    var regExEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return email.match(regExEmail);
}

module.exports.getPathParams = function getPathParams(req){
    return url.parse(req.url).pathname.split('/').slice(1);
};

module.exports.isDisconnectedLink = function(link){
    var dbl, dsl;
    for(var i =0; i < config.disconnectedBeginLinks.length; i++){
        dbl = config.disconnectedBeginLinks[i];
        if(link.indexOf(dbl) == 0)
            return true;
    }
    for(var i =0; i < config.disconnectedStrictLinks.length; i++){
        dsl = config.disconnectedStrictLinks[i];
        if(link == dsl ||link == dsl + '/')
            return true;
    }
    return false;
}

module.exports.isAdminRequiredLink = function(link){
    var arbl, arsl;
    for(var i =0; i < config.adminRequiredBeginLinks.length; i++){
        arbl = config.adminRequiredBeginLinks[i];
        if(link.indexOf(arbl) == 0)
            return true;
    }
    for(var i =0; i < config.adminRequiredStrictLinks.length; i++){
        arsl = config.adminRequiredStrictLinks[i];
        if(link == arsl ||link == arsl + '/')
            return true;
    }
    return false;
}

module.exports.validCreateUserForm = function(username, email, password, checkpassword, next){
    if(username && email && password && checkpassword) {
        User.findOne({$or: [{username: username}, {email: email}]})
            .exec(function (err, user) {
                if (!user) {
                    if(isValidUsername(username)) {
                        if (isValidPassword(password)) {
                            if (password == checkpassword) {
                                if (isValidEmail(email)) {
                                    next(null);
                                } else {
                                    next(errorForm[605]);
                                }
                            } else {
                                next(errorForm[607]);
                            }
                        } else {
                            next(errorForm[606]);
                        }
                    }else{
                        next(errorForm[604]);
                    }
                } else {
                    if (user.username == username) {
                        next(errorForm[602]);
                    } else if (user.email == email) {
                        next(errorForm[603]);
                    }
                }
            });
    }else{
        next(errorForm[601]);
    }
};

module.exports.isValidPassword = isValidPassword;
module.exports.isValidUsername = isValidUsername;
module.exports.isValidEmail = isValidEmail;

//module.exports.getPassword = function getPassword(req, res, next) {
//    logger.info('Getting password from db for user with id:' + Util.getPathParams(req)[2]);
//
//    return User.findById(
//        getPathParams(req)[2],
//        function (err, user) {
//         if (err)
//          next(err.message);
//
//         logger.debug('password retrieved:' + user.password);
//         //if (!! user.password ||_.isNull(user.password) || _.isEmpty(user.password)) {
//         //    logger.error('No password found :o !');
//         //}
//
//         next(user.password);
//
//        });
// };