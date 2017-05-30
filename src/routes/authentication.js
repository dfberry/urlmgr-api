"use strict";

var config = require('../config/config.json');
var libAuthentication = require('../libs/authentication');
var libUser = require('../libs/users');
var libResponse = require('../libs/response');
var express = require('express');
var router = express.Router();
var _ = require('underscore');

var api = { name: "authenticate"};

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

  var email = req.body.email,
      password = req.body.password;

	if(!email || !password) return res.status(422).send({error: "user or password is empty"});

	var user = libUser.getByEmail(email);
	var auth = libAuthentication.authenticate(email, password);

	Promise.all([auth, user])
	.then(result => {
		let tokenResults = result[0];
		let userResults = result[1];
		let meta = {}; // because it is filled by libResponse

		userResults.token = tokenResults;

		return libResponse.buildResponseSuccess(req, api, {}, {user: userResults});
	}).then ( finalObj => {
    res.status(200).send(finalObj);
  }).catch(function(err) {

		if((err==='User & password did not match') || (err==='Authentication failed: Invalid email and/or password supplied.')) {
			
			api.error = { type: "authentication failure", message: "User & password did not match"};
			let data = {}; // because there is an error
			let meta = {}; // because it is filled by libResponse

			libResponse.buildFailureSuccess(req, api, meta, data).then( finalObj => {
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

