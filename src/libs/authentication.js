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

      let decodedToken;

      // decode token
      if (!token) return resolve();

        // Check for the token in the DB
        // if it isn't found - it definitely isn't authorized
        TokenModel.find({"token": token}).then(function(tokenDoc) {

          if (!tokenDoc) throw Error("Token has been revoked, as a result of deletion.");
          if (tokenDoc.revoked) throw Error("Token has been revoked.");

          return Tokens.verify(token,config.jwt);

        }).then(decoded => {
            
          decodedToken = decoded;

          // ISSUE: don't care when promise is returned, don't care if error is thrown
          return Users.setLastLogin(decoded.uuid);
        
        }).then( (nothingIsReturned) => {
          // Send back the claims
          resolve(decodedToken);
        }).catch(err => {
          throw err;
        });
    });
  },
  /* Authenticates a user 

   in: user Object from mongo untouched
   out: user Object from mongo with token

   Returns either a valid JWT token or throws an error

  */
  authenticate: function(email, password) {
    let self = this;

    return new Promise(function(resolve, reject) {

      let foundToken;

      if(!email || !password) reject("email or password is empty");

      // Validate email and password
      if (!self.validate(email, password)) return reject("Authentication failed: Invalid email and/or password supplied."); 
      
      Users.checkPassword(email, password).then(function(user) {
        if (!user) reject("Authentication Failed: No such user.");

        return Users.createReturnableUser(user);
      }).then(returnableUser => {
        // Store JWT in DB for logout/revocation
        return Tokens.insert(returnableUser, self.getToken(returnableUser.email, returnableUser, config.jwt));
      }).then(token => {
        foundToken = token;
        return Users.getByEmail(email);
      }).then( user => {
        user.token = foundToken;
        return resolve(user);
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
      //claims = { email: email, roles: 'none', uuid: undefined }; 
      throw Error("auth - getToken - not wellFormedUser");
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
