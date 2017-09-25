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

      if(!id) return reject("empty id");

      UserModel.findById(id,(err, user) =>{
        if(err)return reject(err);
        return resolve(self.createReturnableUser(user));
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
          if(err) return reject (err);
          return resolve(user);
        });
      } catch (err ){
        return reject(err);
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
          if (err)
              return reject (err);
          if (!user)
              return reject("User doesn't exist - gbe");
          return resolve(self.createReturnableUser(user));
        });
      } catch (err ){
        return reject(err);
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
          if(err) return reject (err);
          return resolve(self.createReturnableUserArray(users));
        });
      } catch (err ){
        return reject(err);
      }
    });
  },
  logout: function(userUuid, token) {
    return new Promise(function(resolve, reject) {
     if(!userUuid || !token) reject("logout params are not valid");
      resolve(Tokens.revoke(userUuid, token));
    });
  },
  create: function(user){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!user) return reject("can't create user because user is empty");
      let userObj = new UserModel(user);


      try{
        userObj.save((err, _user) => {

          if(err)return reject(err); 
          if(!_user) return reject("user not returned");

          // mongoose create is wrapped in another object
          if(_user && _user._doc) return resolve(self.createReturnableUser(_user._doc));      
          return resolve(self.createReturnableUser(_user));
        });
      } catch (err) {
        reject(err);
      }

    });
  },
  setLastLogin: function(id){
    return new Promise(function(resolve, reject) {
      if(!id) return reject('no id');
      let lastLogin = new Date(moment().format());

      UserModel.findByIdAndUpdate(id, { $set: { lastLogin: lastLogin}}, { new: true }, (err, newUser) => {
        if (err) return reject(err);
        return resolve(newUser);
      });
    });
  },
  /*
    returns mongo User object 
  */
  checkPassword: function(email, candidatePassword){
    let self = this;


      if(!email || !candidatePassword) return Promise.reject("email or password not provided");

      return self.getByEmailRaw(email).then( user => {
        if ( !user ) return reject("User does not exist");
        let _user = Promise.resolve(user);
        let _verifyPassword = self.verifyPassword(candidatePassword, user.password);
        return Promise.all([_verifyPassword, _user]);
      }).then( (result) => {
        if (!result[0]) throw("Password doesn't match");
        return (result[1]);
      }).catch( err => {
        throw(err);
      });

  },
  verifyPassword: function(candidatePassword, hashedPassword) {
    return new Promise(function(resolve, reject) {
      if(!candidatePassword || ! hashedPassword) return reject("can't verify empty password");
      bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
        if (err) return reject(err);
        return resolve (isMatch);
      });
    });
  },
  /* doesn't copy over Mongo-ish id or password */
  createReturnableUser(user){

    let token = user.token ? user.token : "";

    let returnObj = {
			id: user._id.toString(),
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
  },
  resetPassword: function(user){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!user || !user.email || !user.password) return reject("can't create user because required params are empty");
      
      let query = { email: user.email };

      UserModel.findOne(query,(err, foundUser) => {

        if(err)return reject(err);
        foundUser.password = user.password;
        foundUser.save(err2 =>{
          
          if(err2)return reject(err2);
          return resolve(self.createReturnableUser(foundUser));
        });
      });
    });
  }
}

module.exports = Users;