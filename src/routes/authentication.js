"use strict";

const config = require('../config/config.json'),
	libAuthentication = require('../libs/authentication'),
	libUser = require('../libs/users'),
	libResponse = require('../libs/response'),
	express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	api = { name: "authenticate"};

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

	return libUser.getByEmail(email).then(user => {
		let returnableUser = libUser.createReturnableUser(user);
		console.log("returnableUser");
		console.log(returnableUser);
		return libAuthentication.authenticate(returnableUser, password);
	}).then(userWithToken => {
		let meta = {};
		return libResponse.buildResponseSuccess(req, api, meta, userWithToken);
	}).then ( finalObj => {
    return res.status(200).send(finalObj);
  }).catch(function(err) {

		if((err==='user is invalid') 
			|| (err==="User doesn't exist")
			|| (err==='User & password did not match') 
			|| (err==='Authentication failed: Invalid email and/or password supplied.')) {
			
			api.error = { type: "authentication failure", message: "User & password did not match"};
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

