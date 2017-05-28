"use strict";

var UserModel = require('../data/user');
var Tokens = require('./tokens');
const bcrypt = require('bcryptjs');
var moment = require('moment');

var Users = {
  deleteAllUsersRaw: function(){
    UserModel.remove().exec();
  },
  getById: function(id) {
    var self = this;
    return new Promise(function(resolve, reject) {
      UserModel.findById(id,(err, user) =>{
        if(err)return reject(err);
        resolve(self.createReturnableUser(user));
      });
    });
  },
  /* returns password hash */
  getByEmailRaw: function(email) {
    var self = this;
    return new Promise(function(resolve, reject) {
      let query = { email: email };
      try{
        return UserModel.findOne(query,(err, user) =>{
          if(err) throw (err);
          resolve(user);
        });
      } catch (err ){
        reject(err);
      }
    });
  },
  getByEmail: function(email) {
    var self = this;
    return new Promise(function(resolve, reject) {
      let query = { email: email };
      try{
        return UserModel.findOne(query,(err, user) =>{
          if(err) throw (err);
          resolve(self.createReturnableUser(user));
        });
      } catch (err ){
        reject(err);
      }
    });
  },
  get: function(uuid) {
    return this.getById(uuid);
  },
  getAll: function(){
    var self = this;
    return new Promise(function(resolve, reject) {
      try{
        UserModel.find({},(err, users) =>{
          if(err) throw (err);
          resolve(self.createReturnableUserArray(users));
        });
      } catch (err ){
        reject(err);
      }
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
        resolve(self.createReturnableUser(_user));
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

      self.getByEmailRaw(email)
      .then( user => {
        if ( !user ) throw new Error("User does not exist");
        var _user = Promise.resolve(user);
        var _verifyPassword = self.verifyPassword(candidatePassword, user.password);
        return Promise.all([_verifyPassword, _user]);
      }).then( (result) => {
        if (!result[0]) throw new Error("Password doesn't match");
        resolve(result[1]);
      }).catch(reject);
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
  createReturnableUser(user){

    let token = user.token ? user.token : "";

    let returnObj = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			lastLogin: user.lastLogin.toDateString(),
      roles: user.roles,
      token: token
		};
    return returnObj;
  },
  createReturnableUserArray(userArray){
    let safeUserArray = [];

    userArray.forEach(function(user, i, collection) {
        safeUserArray.push(this.createReturnableUser(user));
      }, this);

      //console.log("safeUserArray");
      //console.log(safeUserArray);

    return safeUserArray;
  }

}

module.exports = Users;