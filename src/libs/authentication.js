"use strict"
const validator = require('validator'),
  TokenModel = require('../data/index').token,
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
  getClaimsPromise: function(token, ipAddr) {

    let decodedToken;

    if (!token) return Promise.resolve();

    // Check for the token in the DB
    // if it isn't found - it definitely isn't authorized

    let query = TokenModel.find({"token": token}).exec();

    return query.then(function(tokenDoc) {
      console.log("getClaimsPromise step 1");

      if (!tokenDoc) throw Error("Token has been revoked, as a result of deletion.");
      if (tokenDoc.revoked) throw Error("Token has been revoked.");

      return Tokens.verify(token,config.jwt);

    }).then(decoded => {
      console.log("getClaimsPromise step 2");

      let decodedTokenPromise =  Promise.resolve(decoded);

      // ISSUE: don't care when promise is returned, don't care if error is thrown
      let setLastLoginPromise =  Users.setLastLogin(decoded.uuid);
    
      return Promise.all([decodedTokenPromise, setLastLoginPromise]);

    }).then( (arr) => {
      console.log("getClaimsPromise step 3");
      // Send back the claims
      return (arr[0]);
    }).catch(err => {
      console.log("getClaimsPromise catch " + err);
      throw Error(err);
    });

  },
  /* Authenticates a user 

   in: user Object from mongo untouched
   out: user Object from mongo with token

   Returns either a valid JWT token or throws an error

  */
  authenticatePromise: function(email, password) {

    let foundToken;

    if(!email || !password) return Promise.reject("email or password is empty");

    // Validate email and password
    if (!this.validate(email, password)) return Promise.reject("Authentication failed: Invalid email and/or password supplied."); 
    
    return Users.checkPassword(email, password).then(function(user) {
      if (!user) throw("Authentication Failed: No such user.");

      return Users.createReturnableUser(user);
    }).then(returnableUser => {
      // Store JWT in DB for logout/revocation
      return Tokens.insert(returnableUser, this.getToken(returnableUser.email, returnableUser, config.jwt));
    }).then(token => {
      foundToken = token;
      return Users.getByEmail(email);
    }).then( user => {
      user.token = foundToken;
      return (user);
    }).catch(function(error) {
      console.log("authenticatPromise error = " + error);
      throw ("User & password did not match ");
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
