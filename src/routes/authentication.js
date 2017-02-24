"use strict";

var config = require('../config/config.json');
var libAuthentication = require('../libs/authentication');
var libError = require('../libs/error');
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
	held in database. If both match then a JWT is issued. Otherwise a 401 is
	returned.

*/
router.post('/', function(req, res) {

  var email = req.body.email,
      password = req.body.password;

	if(!email || !password) return res.status(422).send({error: "user or password is empty"});
 
  libAuthentication.authenticate(email, password)
	.then(result => {
		// don't return everything!!!
    res.send({token:result.token});
  }).catch(function(err) {

		if(err==='User & password did not match') return res.status(422).send(err);
		return res.status(500).send({ error: err.message });
  });

});

module.exports = router;

