var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;


mongoose.connect('mongodb://localhost/test')

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String},
    nickname: String
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};


var User = mongoose.model('myuser', userSchema);

module.exports = User;