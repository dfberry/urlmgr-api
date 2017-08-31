"use strict";

const config = require('../config.js'),
	libAuthentication = require('../libs/authentication'),
	libUser = require('../libs/users'),
	libResponse = require('../libs/response'),
	express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	api = { name: "authenticate"};

//Hacking mongodb authentication
//https://blog.websecurify.com/2014/08/attacks-nodejs-and-mongodb-part-to.html

/* Authenticates a user based on a username and password. Returns a JWT.

	No pre-authentication

	POST /auth
	{
	  "email": "john.doe@example.com",
	  "password": "password"
	}

	Both email and password are mandatory. Password is matched against hash
	held in database. If both match then a JWT is issued. Otherwise an error is
	returned.

*/
router.post('/', function(req, res) {

	api.action = "verify";

  let email = req.body.email,
      password = req.body.password;

	if(!email || !password) return res.status(422).send({error: "user or password is empty"});

	return libUser.getByEmail(email).then(returnableUser => {
		//let returnableUser = libUser.createReturnableUser(user);
		return libAuthentication.authenticate(email, password);
	}).then(userWithToken => {
		let meta = {};
		return libResponse.buildResponseSuccess(req, api, meta, {user: userWithToken});
	}).then ( finalObj => {
    return res.status(200).send(finalObj);
  }).catch(function(err) {

		if((err.indexOf('user is invalid') != -1)
			|| (err.indexOf("User doesn't exist")!= -1)
			|| (err.indexOf('User & password did not match') != -1)
			|| (err.indexOf('Authentication failed: Invalid email and/or password supplied.')!= -1)) {
			
				api.error = { type: "authentication failure", message: err};
				let data = {}; // because there is an error
				let meta = {}; // because it is filled by libResponse

				return libResponse.buildResponseFailure(req, api, meta, data).then( finalObj => {
				return res.status(422).send(finalObj);
			}).catch(err => {
				return res.status(500).send({ error: err.message });
			})
		} else {
			return res.status(500).send({ error: err.message });
		}
  });
});

module.exports = router;

