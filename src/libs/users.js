"use strict";

const UserModel = require('../data/user'),
  Tokens = require('./tokens'),
  bcrypt = require('bcryptjs'),
  moment = require('moment');

let Users = {
  deleteAllUsersRaw: function(){
    UserModel.remove().exec();
  },
  getById: function(id) {
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!id) reject("empty id");

      UserModel.findById(id,(err, user) =>{
        if(err)return reject(err);
        resolve(self.createReturnableUser(user));
      });
    });
  },
  /* returns password hash */
  getByEmailRaw: function(email) {
    return new Promise(function(resolve, reject) {
      if(!email) reject("empty email");
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
    let self = this;
    return new Promise(function(resolve, reject) {
      if(!email)reject("empty email");
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
    let self = this;
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
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!user) reject("can't create user because user is empty");
      let userObj = new UserModel(user);
      userObj.save((err, _user) => {
        if(err)return reject(err);       
        resolve(self.createReturnableUser(_user));
      });
    });
  },
  setLastLogin: function(id){
    return new Promise(function(resolve, reject) {
      if(!id) reject('no id');
      let lastLogin = new Date(moment().format());

      UserModel.findByIdAndUpdate(id, { $set: { lastLogin: lastLogin}}, { new: true }, (err, newUser) => {
        if (err) reject(err);
        resolve(newUser);
      });
    });
  },
  checkPassword: function(email, candidatePassword){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!email || !candidatePassword) reject("email or password not provided");

      self.getByEmailRaw(email).then( user => {
        if ( !user ) throw new Error("User does not exist");
        let _user = Promise.resolve(user);
        let _verifyPassword = self.verifyPassword(candidatePassword, user.password);
        return Promise.all([_verifyPassword, _user]);
      }).then( (result) => {
        if (!result[0]) throw new Error("Password doesn't match");
        resolve(result[1]);
      }).catch(reject);
    });
  },
  verifyPassword: function(candidatePassword, hashedPassword) {
    return new Promise(function(resolve, reject) {
      if(!candidatePassword || ! hashedPassword) reject("can't verify empty password");
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
    return safeUserArray;
  }
}

module.exports = Users;