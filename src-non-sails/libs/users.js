"use strict";

var UserModel = require('../data/user');
//var TokenModel = require('../data/token');
var moment = require('moment');

var Users = {

  getById: function(id) {
    return new Promise(function(resolve, reject) {
      UserModel.findById(id, (err, status) =>{
        if(err)reject(err);
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
      userObj.save((err, _user) =>{
        if(err)reject(err);
        resolve(_user);
      });
    });
  }
  /*,
  setLastLogin: function(id){
    return new Promise(function(resolve, reject) {

      UserModel.findByIdAndUpdate(id, { $set: { lastLogin: moment }}, { new: true }, (err, newUser) => {
        if (err) reject(err);
        resolve(newUser);
      });
    });
  },
  checkPassword: function(email, password){
    var self = this;
    return new Promise(function(resolve, reject) {
      var query = { where: { email: email } };
      UserModel.findOne(query).then(function(user) {
        if (!user) throw new Error("User does not exist");
        return Promise.all([user.verifyPassword(password), user]);
      }).then(function([result, user]) {
        if (!result) throw new Error("Password doesn't match");
        resolve(user);
      }).catch(function(error) {
        reject(error);
      });
    });
  }*/
}

module.exports = Users;