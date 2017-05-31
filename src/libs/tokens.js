"use strict";
const TokenModel = require('../data/token'),
  jwt = require('jsonwebtoken');


let Tokens = {
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
  insert: function(token){
    return new Promise(function(resolve, reject) {

      if(!token) reject("can't create token because token is empty");

      let tokenObj = new TokenModel(token);

      tokenObj.save((err, token) => {
        if(err)return reject(err);
        resolve(token);
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
  }
};

module.exports = Tokens;