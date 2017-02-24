"use strict"
var validator = require('validator');
var util = require('util');
var TokenModel = require('../data/token');
var Tokens = require('./tokens');
var Users = require('./users');
var config = require('../config/config.json');

/** PUBLIC API **/

var Authentication = {

  /* Checks for a valid JWT

   Returns a claims object if valid, otherwise errors
   Verifies token exists in DB and is not revoked
   Sets Last Login time
  */
  getClaims: function(dbconnection, tokenUuid, ipAddr) {
    var self = this;

    return new Promise(function(resolve, reject) {
      // decode token
      if (!token) return resolve();
      
        // Check for the token in the DB
        TokenModel.findById(tokenUuid).then(function(token) {

          if (!token) throw new Error("Token has been revoked, as a result of deletion.");
          if (token.revoked) throw new Error("Token has been revoked.");

          var decoded = token.verify(config.jwt);
          
          // ISSUE: don't care when promise is returned, don't care if error is thrown
          if (decoded.uuid) Users.setLastLogin(decoded.uuid).catch((error) => { console.log(error); });

          // Send back the claims
          resolve(decoded);
        }).catch(function(error) {
          // If a bad token is supplied probably best to stop right there
          reject(error);
        });

    });
  },

  /* Authenticates a user 

   Returns either a valid JWT token or throws an error

  */
  authenticate: function(email, password) {
    var self = this;
  
    return new Promise(function(resolve, reject) {

      // Validate email and password
      if (!validate(email, password)) return reject("Authentication failed: Invalid email and/or password supplied."); 
      Users.checkPassword(email, password).then(function(user) {
        if (!user) throw new Error("Authentication Failed: No such user.");
        let _user = JSON.parse(JSON.stringify(user))
        // Store JWT in DB for logout/revocation
        var token = getToken(email, _user, config.jwt);

        return Tokens.insert(token);
      }).then(function(dbtoken) {
        resolve(dbtoken);
      }).catch(function(error) {
        reject(error);
      });

    });
  }

};

/** PRIVATE FUNCTIONS **/

function validate(email, password) {
  if (!email) return false;
  if (!password) return false;
  if (!validator.isEmail(email)) return false;

  return true; 
}

function getToken(email, user, jwtConfig) {
  var role, claims, jwt;

  if (!user) {
    claims = { email: email, role: 'none', uuid: undefined }; 
  }else{
    role = user.role;
    claims = { email: email, role: user.role, uuid: user._id }; 
  }
      
  // Generate a JWT based on result
  jwt = Tokens.create(claims, config.jwt);

  return jwt;
}

/** EXPORT **/

module.exports = Authentication;
