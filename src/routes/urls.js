"use strict";

var express = require('express');
var router = express.Router();
var urlLib = require('../libs/urls');
var libAuthorization = require('../libs/authorization');


// create 1
router.post('/', libAuthorization.AdminOrId, function(req, res) {
  var data = req.body;
  data.userUuid = req.claims.uuid;

  urlLib.create(data)
  .then( (results) => {
    res.status(200).json(results);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get 1  
router.get("/:id", libAuthorization.AdminOrId, function(req, res) {
  var id = req.params.id;

  urlLib.getById(id)
  .then( (results) => {
    res.status(200).send();
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get all  
router.get("/", libAuthorization.AdminOrId, function(req, res) {
  //TODO = pass in uuid for all requests
  //so only urls associated with user are returned
  //req.claims.uuid
  urlLib.getAll()
  .then( (results) => {
    res.status(200).json(results);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// delete 1
router.delete("/:id", libAuthorization.AdminOrId, function(req, res) {
  var id = req.params.id;
  urlLib.deleteById(id)
  .then( results => {
    res.status(200).json(results);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

module.exports = router;