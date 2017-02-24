"use strict";

var config = require('../config/config.json');
var libError = require('./error');
var libAuthentication = require('./authentication');

module.exports = function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'],
        ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // decode token
    if (token) {
      libAuthentication.getClaims(token, ip).then(function(claims) {
        // Store the actual claims
        req.claims = claims;
        next();
      }).catch(function(error) {
        // If a bad token is supplied probably best to stop right there
        libError.send(error);
      });
    }else{
      // Continue without any rights
	  next(); 
    }

};