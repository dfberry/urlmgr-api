"use strict";
var TokenModel = require('../data/token');
var jwt = require('jsonwebtoken');
var Tokens = {

  create: function(user, jwtConfig){
    return new Promise(function(resolve, reject) {


      if(!user) return reject("user is not found");
      if(!jwtConfig) return reject("jwtConfig");

      let claims = { email: user.email, 
                    role: user.role || 'none',
                    userUuid: user._id,     
                    random: Math.random()
                  };
                  
      let options = { expiresIn: "7 days",
                      issuer: jwtConfig.issuer };

       let token = { userUuid: user._id,
                    role: user.role || 'none',
                    revoked: false,
                    token: jwt.sign(claims, jwtConfig.secret, options) };
        var tokenObj = new TokenModel(token);

        tokenObj.save((err, _token) =>{
          if(err)return reject(err);
          resolve(_token);
        });
    });
  },

  revoke: function revoke(userUuid, token) {
    return new Promise(function(resolve, reject) {
      var query = { userUuid: userUuid };
      var newValue = { $set: { revoked: true }};
      if (token) query.token = token;

      TokenModel.update(query, newValue, (err, result) => {
        if(err) reject(err);
        resolve(result);
      });
    });
  }
/*
    verify: function verify(token){
  try {
    var decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (err) {
    throw err;
  }
}
// class method
tokenSchema.statics.buildTokenForUser = function buildTokenForUser(user){
  // Create JWT including claims (i.e. role, user info)
  var claims = { email: user.email, 
              uuid: user.uuid,
              random: Math.random()
            },
  options = { expiresIn: "7 days",
              issuer: config.jwt.issuer },
  token = { userUuid: user.uuid, 
            token: jwt.sign(claims, config.jwt.secret, options) };

  return token;  
}

*/

}


module.exports = Tokens;