"use strict";

var config = require('../config/config.json');
var libAuthentication = require('../libs/authentication');
var libUser = require('../libs/users');
var libMeta = require('../libs/meta');
var express = require('express');
var router = express.Router();

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

  var email = req.body.email,
      password = req.body.password;

	if(!email || !password) return res.status(422).send({error: "user or password is empty"});

	var user = libUser.getByEmail(email);
	var auth = libAuthentication.authenticate(email, password);

	Promise.all([auth, user])
	.then(result => {
		let authResults = result[0];
		let userResults = result[1];
		
		return libUser.createReturnableUser(userResults, authResults.token);
	}).then( returnableObj => {
		return libMeta.mergeWithMeta(returnableObj);
	}).then ( finalObj => {
    res.status(200).send(finalObj);
  }).catch(function(err) {

		if(err==='User & password did not match') return res.status(422).send(err);
		return res.status(500).send({ error: err.message });
  });

});

module.exports = router;

