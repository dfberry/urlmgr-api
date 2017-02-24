"use strict";

/* Error handling Middleware for App

   TODO: Find a way to set appropriate status codes based on errors
   Design Custom Errors

*/
var handler = function(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    send(res, err);
};

var send = function(res, err, friendly) {
  console.log("error.js - send " + err);
  res.status(500).send({ error: err.message });
};

module.exports.handler = handler;
module.exports.send = send;