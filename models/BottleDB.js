/**
 * Created by lmangeat on 14/12/2015.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Bottle = new Schema({
    vineyard: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    year: { type: Number, required: true },
    conservation: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: Number, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

Bottle.pre('save', function (next) {
    var now = new Date();

    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }

    next();
});

exports.Bottle = mongoose.model('Bottle', Bottle);