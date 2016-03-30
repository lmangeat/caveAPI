/**
 * Created by Léon on 30/03/2016.
 */

var logger = require('log4js').getLogger('controller.user'),
    mongoose = require('mongoose'),
    sanitizer = require('sanitizer'),
    _ = require('lodash'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    Util = require('./utils/util.js'),
    errorForm = require("../config/ErrorForm.js").error,
    config = require('../config/config.json'),
    CaveDB = require('../models/CaveDB'),
    Cave = mongoose.model('Cave'),
    UserDB = require('../models/UserDB'),
    User = mongoose.model('User');

//REST: /login
module.exports.login = function login(req, res, next){
    var username = sanitizer.escape(req.body.username),
        password = sanitizer.escape(req.body.password);
    User.findOne({
            username: username
        }).exec(function(err, user){
            if(user && bcrypt.compareSync(password, user.password)){
                var token = jwt.sign(user, config.pwd.secret);
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(token || {}, null, 2));
            }else{
                res.set('Content-Type', 'application/json');
                res.status(403).json(JSON.stringify({error: "Forbidden: authentication failure"}, null, 2));
            }
        });
};