"use strict"
const validator = require('validator'),
  TokenModel = require('../data/token'),
  Tokens = require('./tokens'),
  Users = require('./users'),
  config = require('../config.js');

/** PUBLIC API **/

let Authentication = {

  /* Checks for a valid JWT

   Returns a claims object if valid, otherwise errors
   Verifies token exists in DB and is not revoked
   Sets Last Login time
  */
  // TODO: what was ipAddr for?
  getClaims: function(token, ipAddr) {

    return new Promise(function(resolve, reject) {
      // decode token
      if (!token) return resolve();

        // Check for the token in the DB
        // if it isn't found - it definitely isn't authorized
        TokenModel.find({"token": token}).then(function(tokenDoc) {

          if (!tokenDoc) throw Error("Token has been revoked, as a result of deletion.");
          if (tokenDoc.revoked) throw Error("Token has been revoked.");

          let decoded = Tokens.verify(token,config.jwt);
          
          // ISSUE: don't care when promise is returned, don't care if error is thrown
          if (decoded.uuid) Users.setLastLogin(decoded.uuid).catch((error) => { console.log(error); });

          // Send back the claims
          resolve(decoded);
        }).catch(reject);
    });
  },
  /* Authenticates a user 

   in: user Object from mongo untouched
   out: user Object from mongo with token

   Returns either a valid JWT token or throws an error

  */
  authenticate: function(user, password) {
    let self = this;

    return new Promise(function(resolve, reject) {

      if(!user || !user.email || !password) reject("user is invalid");

      // Validate email and password
      if (!self.validate(user.email, password)) return reject("Authentication failed: Invalid email and/or password supplied."); 
      
      Users.checkPassword(user.email, password).then(function(user) {
        if (!user) reject("Authentication Failed: No such user.");
        let _user = JSON.parse(JSON.stringify(user));
        // Store JWT in DB for logout/revocation

        return Tokens.insert(user, self.getToken(user.email, _user, config.jwt));
      }).then(function(userWithToken) {
        resolve(userWithToken);
      }).catch(function(error) {
        reject("User & password did not match");
      });

    });
  },
  createReturnableToken(token){

    if(!token) return {};

    let returnToken = {
			user: token.userUuid,
			revoked: token.revoked,
			token: token.token
		};
    return returnToken;
  },
  validate: function (email, password) {
    if (!email) return false;
    if (!password) return false;
    if (!validator.isEmail(email)) return false;

    return true; 
  },
  // TODO: what is jwtConfig for?
  getToken:function (email, wellFormedUser, jwtConfig) {
    let claims, jwt;

    if (!wellFormedUser) {
      claims = { email: email, roles: 'none', uuid: undefined }; 
    }else{
      claims = { email: email, role: wellFormedUser.roles, uuid: wellFormedUser.id }; 
    }
        
    // Generate a JWT based on result
    jwt = Tokens.create(claims, jwtConfig);

    return jwt;
  }
};

/** EXPORT **/

module.exports = Authentication;
