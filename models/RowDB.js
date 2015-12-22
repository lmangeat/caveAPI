/**
 * Created by lmangeat on 14/12/2015.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Row = new Schema({
    bottles: { type: [{type: Schema.ObjectId, ref: 'Bottle'}], required: true },
    nbMaxBottles: { type: Number, required: true},
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

Row.pre('save', function (next) {
    var now = new Date();

    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }

    next();
});

exports.Row = mongoose.model('Row', Row);