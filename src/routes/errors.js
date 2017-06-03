"use strict";

const config = require('../config.js'),
  express = require('express'),
  _ = require('underscore'),
  libResponse = require('../libs/response.js');

function errorHandler(err, req, res, next) {

  //let errorStack = (app.get('env') === 'development') ? err : {};
  let errorStack = err;

  if (err.name === 'UnauthorizedError') {

    console.log("untreated error " + req.path + " " + req.method);

    res.status(401).json({
        message : err.message,
        error: errorStack
    });
  } else if (err.message.indexOf("AuthFailure") >= 0){

    libResponse.buildResponseFailure(req, {url: req.url, api: req.path, method: req.method, error: { type: "auth", msg: err.message, stack: errorStack}}, {}, {}).then( json => {
        res.status(422).json(json);
    }).catch(err => {
        res.status(500).json(err);
    });
  } else 
    next(err);
}

module.exports = errorHandler;