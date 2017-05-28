"use strict";
var TokenModel = require('../data/token');
var jwt = require('jsonwebtoken');


var Tokens = {
  create: function(user, jwtConfig) {
    // Create JWT including claims (i.e. role, user info)
    // TBD: why is token role none?
    var claims = { email: user.email, 
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
    var self = this;
    return new Promise(function(resolve, reject) {
      var tokenObj = new TokenModel(token);
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
      var decoded = jwt.verify(token, jwtConfig.secret);
      return decoded;
    } catch (err) {
      throw err;
    }
  },
  // not setting revoke, just deleting it
  // TBD: why have revoke on the token then
  revoke: function(userUuid, token){
    var self = this;
    return new Promise(function(resolve, reject) {
      var conditions = {
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