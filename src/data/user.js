"use strict"
const db = require('mongoose');
const loadClass = require('mongoose-class-wrapper');
const uuid = require('node-uuid'),
  bcrypt = require('bcryptjs'),
  SALT_WORK_FACTOR = 10;
db.Promise = require('bluebird');

var userSchema = new db.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// before saving, hash password
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



class UserModel {
}

// Add methods from class to schema 
userSchema.plugin(loadClass, UserModel);

module.exports = db.model('User', userSchema);