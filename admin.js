/**
 * Created by Buwaneka on 8/31/17.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var adminSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

adminSchema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

adminSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        if (err) {
            return done(false);
        }
        done(isMatch);
    });
};

var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
