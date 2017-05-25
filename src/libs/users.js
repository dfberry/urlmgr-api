"use strict";

var UserModel = require('../data/user');
var Tokens = require('./tokens');
const bcrypt = require('bcryptjs');
var moment = require('moment');

var Users = {

  getById: function(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
      UserModel.findById(id,(err, status) =>{
        if(err)return reject(err);
        resolve(status);
      });
    });
  },
  getByEmail: function(email) {
    var self = this;
    return new Promise(function(resolve, reject) {
      let query = { email: email };
      try{
        return UserModel.findOne(query,(err, status) =>{
          if(err) throw (err);
          resolve(status);
        });
      } catch (err ){
        reject(err);
      };
    });
  },
  get: function(uuid) {
    return getById(uuid);
  },
  getAll: function(){
    var self = this;
    return new Promise(function(resolve, reject) {
      try{
        return UserModel.find({},(err, users) =>{
          if(err) throw (err);
          self.createReturnableUserArray(users);
          resolve(users);
        });
      } catch (err ){
        reject(err);
      };
    });
  },
  logout: function(userUuid, token) {
    return Tokens.revoke(userUuid, token);
  },
  create: function(user){
    var self = this;
    return new Promise(function(resolve, reject) {
      var userObj = new UserModel(user);
      userObj.save((err, _user) => {
        if(err)return reject(err);       
        resolve(_user);
      });
    });
  },
  setLastLogin: function(id){
    return new Promise(function(resolve, reject) {
      
      let lastLogin = new Date(moment().format());

      UserModel.findByIdAndUpdate(id, { $set: { lastLogin: lastLogin}}, { new: true }, (err, newUser) => {
        if (err) reject(err);
        resolve(newUser);
      });
    });
  },
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
  },
  /* doesn't copy over Mongo-ish id or password */
  createReturnableUser(user, token){
    let returnObj = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			lastLogin: user.lastLogin.toDateString(),
      roles: user.roles
		};
    if(token) returnObj.token = token;
    return returnObj;
  },
  createReturnableUserArray(userArray){
    return userArray.forEach(function(user, i, collection) {
        userArray[i] = this.createReturnableUser(user, null);
      }, this);
  }

}

module.exports = Users;