/**
 * Created by lmangeat on 14/12/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cookies = require("cookies");
var jwt = require('jsonwebtoken');
var config = require('../config.json');

var UserDB = require('../models/UserDB');
var User = mongoose.model('User');

router.get('/test', function(req, res, next) {
    var user = new User(
        {
            username: "test",
            email: "test@test.fr",
            password: "azerty",
            caves: []
        }
    );
    user.save();
    var token = jwt.sign(user, config.pwd.secret);
    new Cookies(req, res).set('token', token, {
        httpOnly: true,
        secure: false      // for your dev environment => true for prod
    });
    res.redirect('/');
});

router.get('/testAdmin', function(req, res, next) {
    var user = new User(
        {
            username: "testAdmin",
            email: "testAdmin@test.fr",
            password: "azerty",
            admin: true,
            caves: []
        }
    );
    user.save();
    var token = jwt.sign(user, config.pwd.secret);
    new Cookies(req, res).set('token', token, {
        httpOnly: true,
        secure: false      // for your dev environment => true for prod
    });
    res.redirect('/');
});

module.exports = router;