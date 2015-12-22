/**
 * Created by lmangeat on 14/12/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cookies = require("cookies");
var jwt = require('jsonwebtoken');
var config = require('../Configs/config.json');
var bcrypt = require("bcryptjs");

var UserDB = require('../models/UserDB');
var User = mongoose.model('User');
var CaveDB = require('../models/CaveDB');
var Cave = mongoose.model('Cave');
var RowDB = require('../models/RowDB');
var Row = mongoose.model('Row');
var BottleDB = require('../models/BottleDB');
var Bottle = mongoose.model('Bottle');

router.post('/', function(req, res, next) {
    User.findOne({
        username: req.body.username
    }).exec(function(err, user){
        console.log(req.body.password);
        if(user && bcrypt.compareSync(req.body.password, user.password)){
            var token = jwt.sign(user, config.pwd.secret);
            new Cookies(req, res).set('token', token, {
                httpOnly: true,
                secure: false      // for your dev environment => true for prod
            });
            res.json({success: true});
        }else{
            res.json({success: false});
        }
    });
});

router.get('/test', function(req, res, next) {
    var bottle1Row1Cave1 = new Bottle({
        vineyard: "Vineyard bottle 1 Row 1 Cave 1",
        color: "Red",
        type: "Type bottle 1 Row 1 Cave 1",
        year: 1990,
        conservation: 20,
        name: "Name bottle 1 Row 1 Cave 1",
        position: 1
    });
    var bottle2Row1Cave1 = new Bottle({
        vineyard: "Vineyard bottle 2 Row 1 Cave 1",
        color: "Red",
        type: "Type bottle 2 Row 1 Cave 1",
        year: 1992,
        conservation: 20,
        name: "Name bottle 2 Row 1 Cave 1",
        position: 2
    });
    var bottle1Row2Cave1 = new Bottle({
        vineyard: "Vineyard bottle 1 Row 2 Cave 1",
        color: "White",
        type: "Type bottle 1 Row 2 Cave 1",
        year: 2005,
        conservation: 15,
        name: "Name bottle 1 Row 2 Cave 1",
        position: 1
    });
    var bottle2Row2Cave1 = new Bottle({
        vineyard: "Vineyard bottle 2 Row 2 Cave 1",
        color: "White",
        type: "Type bottle 2 Row 2 Cave 1",
        year: 2003,
        conservation: 15,
        name: "Name bottle 2 Row 2 Cave 1",
        position: 2
    });
    var bottle1Row1Cave2 = new Bottle({
        vineyard: "Vineyard bottle 1 Row 1 Cave 2",
        color: "Red",
        type: "Type bottle 1 Row 1 Cave 2",
        year: 1990,
        conservation: 20,
        name: "Name bottle 1 Row 1 Cave 2",
        position: 1
    });
    var bottle2Row1Cave2 = new Bottle({
        vineyard: "Vineyard bottle 2 Row 1 Cave 2",
        color: "Red",
        type: "Type bottle 2 Row 1 Cave 2",
        year: 1992,
        conservation: 20,
        name: "Name bottle 2 Row 1 Cave 2",
        position: 2
    });
    var bottle1Row2Cave2 = new Bottle({
        vineyard: "Vineyard bottle 1 Row 2 Cave 2",
        color: "White",
        type: "Type bottle 1 Row 2 Cave 2",
        year: 2005,
        conservation: 15,
        name: "Name bottle 1 Row 2 Cave 2",
        position: 1
    });
    var bottle2Row2Cave2 = new Bottle({
        vineyard: "Vineyard bottle 2 Row 2 Cave 2",
        color: "White",
        type: "Type bottle 2 Row 2 Cave 2",
        year: 2003,
        conservation: 15,
        name: "Name bottle 2 Row 2 Cave 2",
        position: 2
    });
    /*
    bottle1Row1Cave1.save();
    bottle2Row1Cave1.save();
    bottle1Row2Cave1.save();
    bottle2Row2Cave1.save();
    bottle1Row1Cave2.save();
    bottle2Row1Cave2.save();
    bottle1Row2Cave2.save();
    bottle2Row2Cave2.save();
*/
    var row1Cave1 = Row({
        bottles:[bottle1Row1Cave1, bottle2Row1Cave1],
        nbMaxBottles: 20
    });
    var row2Cave1 = Row({
        bottles:[bottle1Row2Cave1, bottle2Row2Cave1],
        nbMaxBottles: 20
    });
    var row1Cave2 = Row({
        bottles:[bottle1Row1Cave2, bottle2Row1Cave2],
        nbMaxBottles: 20
    });
    var row2Cave2 = Row({
        bottles:[bottle1Row2Cave2, bottle2Row2Cave2],
        nbMaxBottles: 20
    });
    /*
    row1Cave1.save();
    row2Cave1.save();
    row1Cave2.save();
    row2Cave2.save();
*/
    var cave1 = new Cave({
        rows:[row1Cave1, row2Cave1]
    });
    var cave2 = new Cave({
        rows:[row1Cave2, row2Cave2]
    });
    /*
    cave1.save();
    cave2.save();
*/
    var user = new User(
        {
            username: "test",
            email: "test@test.fr",
            password: "azerty",
            caves: [cave1, cave2]
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