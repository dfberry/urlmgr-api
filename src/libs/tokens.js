"use strict";
const TokenModel = require('../data/token'),
  jwt = require('jsonwebtoken');


let Tokens = {
  deleteAllRaw: function(){
    TokenModel.remove().exec();
  },
  getByUserId: function(userUuid){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!userUuid) return reject("empty user id");

      let query = {userUuid: userUuid};
      console.log("query");
      console.log(query);

      TokenModel.find(query,(err, tokens) =>{
        if(err)return reject(err);
        return resolve(self.createReturnableToken(tokens));
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

      tokenObj.save((err, token) => {
        if(err)return reject(err);
        //console.log(token);
        user.token = self.createReturnableToken(token);
        resolve(user);
      }).catch(err => {
        reject(err);
      });
    });
  },
  verify: function(token, jwtConfig) {
  try {
      let decoded = jwt.verify(token, jwtConfig.secret);
      return decoded;
    } catch (err) {
      throw err;
    }
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
      id: rawToken._id,
      userUuid:rawToken.userUuid,
      token: rawToken.token,
      revoked:rawToken.revoked,
      role:rawToken.role
    };
  },
  createReturnableTokenArray(tokens){
    let safeArray = [];

    //console.log("raw tokens");
    //console.log(tokens)

    tokens.forEach(function(token, i, collection) {
        safeArray.push(this.createReturnableToken(token));
      }, this);
    return safeArray;
  }
};

module.exports = Tokens;