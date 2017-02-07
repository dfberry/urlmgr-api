"use strict";

var UserModel = require('../data/user');
const bcrypt = require('bcryptjs');
//var TokenModel = require('../data/token');

var Users = {

  getById: function(id) {
    return new Promise(function(resolve, reject) {
      UserModel.findById(id,(err, status) =>{
        if(err)return reject(err);
        resolve(status);
      });
    });
  },
  getByEmail: function(email) {
    return new Promise(function(resolve, reject) {
      let query = { email: email };
      UserModel.findOne(query,(err, status) =>{
        if(err)return reject(err);
        resolve(status);
      });
    });
  },
  // if token is empty, removes all tokens for user
  // if user has a token for each device, they will have to login to each device after this
  /*
  logout: function(uuid, token){
    return new Promise(function(resolve, reject) {
      if(token) {
        TokenModel.remove({ user: uuid, _id: token }, (err, status) =>{
          if(err)reject(err);
          resolve(status);
        });
      } else {
        TokenModel.remove({user: uuid}, (err, status) => {
          if(err)reject(err);
          resolve(status);
        });
      }
    });
  },
  */
  create: function(user){
    return new Promise(function(resolve, reject) {
      var userObj = new UserModel(user);
      userObj.save((err, _user) => {
        if(err)return reject(err);
        resolve(_user);
      });
    });
  },/*,
  setLastLogin: function(id){
    return new Promise(function(resolve, reject) {

      UserModel.findByIdAndUpdate(id, { $set: { lastLogin: moment }}, { new: true }, (err, newUser) => {
        if (err) reject(err);
        resolve(newUser);
      });
    });
  },
  */
  checkPassword: function(email, candidatePassword){
    var self = this;
    return new Promise(function(resolve, reject) {

      self.getByEmail(email)
      .then( user => {
        if ( !user ) throw new Error("User does not exist");
        var _user = Promise.resolve(user);
        var _verifyPassword = self.verifyPassword(candidatePassword, user.password);
        return Promise.all([_verifyPassword, _user]);
      }).then( (result) => {
        if (!result[0]) throw new Error("Password doesn't match");
        resolve(result[1]);
      }).catch(function(error) {
        reject(error);
      });
    });
  },
  verifyPassword: function(candidatePassword, hashedPassword) {
    return new Promise(function(resolve, reject) {
      bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
        if (err) return reject(err);
        resolve (isMatch);
      });
    });
  }
}

module.exports = Users;