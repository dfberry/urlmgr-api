"use strict";

module.exports = function(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'],
        ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // if no token, Continue without any rights 
    if (!token) return next(); 

    // decode token
    req.app.locals.libraries.authentication.getClaimsPromise(token, ip).then(function(claims) {
      console.log("getClaimsPromise success");
      // Store the actual claims
      req.claims = claims;
      next();
    }).catch(function(error) {
      console.log("getClaimsPromise failure");
      // If a bad token is supplied probably best to stop right there
      res.sendStatus(500).send("CLAIM_ERROR " + error);
    });
};