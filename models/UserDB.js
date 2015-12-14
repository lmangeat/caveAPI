/**
 * Created by lmangeat on 14/12/2015.
 */
var mongoose = require('mongoose'),
    bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var User = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    caves: { type: [{type: Schema.ObjectId, ref: 'Cave'}], required: false },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

User.pre('save', function (next) {
    var user = this;
    var now = new Date();

    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

exports.User = mongoose.model('User', User);