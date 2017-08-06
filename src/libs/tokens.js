"use strict";
const TokenModel = require('../data/token'),
  jwt = require('jsonwebtoken');


let Tokens = {
  deleteAllRaw: function(){
    TokenModel.remove().exec();
  },
  getByUserId: function(user){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!user || !user.id) return reject("empty user id");

      // TBD: this is not correct - id should already be a string
      let query = "{userUuid: '" + user.id + "'}";

      TokenModel.find(query,(err, tokens) =>{
        if(err) return reject(err);
        return resolve(self.createReturnableTokenArrayForUser(tokens));
      });
    });
  },
  create: function(user, jwtConfig) {
    // Create JWT including claims (i.e. role, user info)
    // TBD: why is token role none?
    let claims = { email: user.email, 
                   role: user.role,
                   uuid: user.uuid,
                   random: Math.random()
                  },
        options = { expiresIn: "7 days",
                    issuer: jwtConfig.issuer },
        token = { userUuid: user.uuid, 
                  token: jwt.sign(claims, jwtConfig.secret, options),
                  role: 'none',
                  revoked: false 
        };
      
    return token;
  },
  insert: function(user, token){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!user || !token) reject("can't create token because user or token is empty");

      let tokenObj = new TokenModel(token);
      tokenObj.userUuid = user.id;

      tokenObj.save((err, newtoken) => {
        if(err)return reject(err);
        resolve(self.createReturnableToken(newtoken));
      }).catch(err => {
        reject(err);
      });
    });
  },
  verify: function(token, jwtConfig) {
    return new Promise(function(resolve, reject) {
      let options = {};

      jwt.verify(token, jwtConfig.secret, options, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  },
  // not setting revoke, just deleting it
  // TBD: why have revoke on the token then
  revoke: function(userUuid, token){

    return new Promise(function(resolve, reject) {
      let conditions = {
        userUuid: userUuid,
        token: token
      };
      TokenModel.remove(conditions, (err) => {
        if(err)return reject(err);
        resolve();
      });
    });
  },
  createReturnableToken:function(rawToken){
    return {
        id: rawToken._id.toString(),
        userUuid:rawToken.userUuid.toString(),
        token: rawToken.token,
        revoked:rawToken.revoked,
        role:rawToken.role
      };
  },
  createReturnableTokenArrayForUser(tokens){
    let safeArray = [];

    tokens.forEach(function(token, i, collection) {
        safeArray.push(this.createReturnableToken(token));
      }, this);
    return safeArray;
  }
};

module.exports = Tokens;