/**
 * Created by Léon on 31/03/2016.
 */
var jwt = require('jsonwebtoken'),
    config = require('../config/config.json'),
    Utils = require('../controllers/utils/util.js');

module.exports.checkAccessToken = function checkAccessToken(req, res, next){
    var token = req.header('token');
    if(Utils.isDisconnectedLink(req.url) || req.url == '/'){
        next();
    }else{
        if(token){
            jwt.verify(token, config.pwd.secret, function(err, decoded) {
                if(err){
                    res.set('Content-Type', 'application/json');
                    res.status(403).json(JSON.stringify({error: "Forbidden: Access denied"}, null, 2));
                }
                else
                if(Utils.isAdminRequiredLink(req.url) && decoded.admin == false){
                    res.set('Content-Type', 'application/json');
                    res.status(403).json(JSON.stringify({error: "Forbidden: Access denied"}, null, 2));
                }
                else
                    next();
            });
        }else{
            res.set('Content-Type', 'application/json');
            res.status(403).json(JSON.stringify({error: "Forbidden: Access denied"}, null, 2));
        }
    }
}