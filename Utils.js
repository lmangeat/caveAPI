/**
 * Created by lmangeat on 15/12/2015.
 */
var config = require('./config.json');

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