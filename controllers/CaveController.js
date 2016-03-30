/**
 * Created by Léon on 23/03/2016.
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

//REST: GET /users
module.exports.getCaves = function getCaves(req, res, next) {
    logger.info('Getting all caves from db...');

    Cave.find({})
        //.limit(size)
        .exec(function (err, caves) {
            if (err)
                return next(err.message);

            if (_.isNull(caves) || _.isEmpty(caves)) {
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't gets caves"}, null, 2));
            }
            else {
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(caves || {}, null, 2));
            }
        });
};

//REST: GET /caves/user/{id}
module.exports.getUserCaves = function getUserCaves(req, res, next) {
    logger.info('Getting user\'s '+ Util.getPathParams(req)[2] +' caves from db...');

    User.findOne({_id: Util.getPathParams(req)[2]})
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


//REST: POST /caves/create/user/{id}
module.exports.createCave = function createCave(req, res, next){
    logger.info('Creating cave for user '+Util.getPathParams(req)[3]);

    var cave = new Cave({
        rows: []
    });

    cave.save(function(err, cave){
        if (err) {
            res.set('Content-Type', 'application/json');
            res.json(err);
            res.status(600).json(JSON.stringify({error: errorForm[600].message}, null, 2));
        }

        User.findOne({_id: Util.getPathParams(req)[3]})
            .populate('caves')
            .exec(function(err, user){
                if(!err){
                    user.caves.push(cave);
                    user.save(function(err){
                        if(!err){
                            res.set('Content-Type', 'application/json');
                            res.end(JSON.stringify(cave || {}, null, 2));
                        }
                    });
                }

                //If Error
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't create cave"}, null, 2));
            });
    });
};

//REST: DELETE /caves/delete/id/{id}
module.exports.deleteCaveById = function deleteCaveById(req, res, next){
    Cave.remove({_id: Util.getPathParams(req)[3]})
        .exec(function(err, cave){
            if(!err){
                res.set('Content-Type', 'application/json');
                res.end(JSON.stringify(cave || {}, null, 2));
            }else{
                res.set('Content-Type', 'application/json');
                res.status(404).json(JSON.stringify({error: "Couldn't delete cave"}, null, 2));
            }
        });

    var token = req.header('token');
    jwt.verify(token, config.pwd.secret, function(err, decoded){
        console.log(decoded);
    });

    //TODO: Delete cave from user object (user's id in token)
};