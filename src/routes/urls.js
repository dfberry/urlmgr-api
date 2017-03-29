"use strict";

var express = require('express');
var router = express.Router();
var urlLib = require('../libs/urls');
var libAuthorization = require('../libs/authorization');
var libMeta = require('../libs/meta');

// create 1
router.post('/', libAuthorization.AdminOrId, function(req, res) {
  var data = req.body;
  data.userUuid = req.claims.uuid;

  urlLib.create(data).then(results => {
		return libMeta.mergeWithMeta(results);
	}).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

router.post('/meta', libAuthorization.AdminOrId, function(req, res) {
  var data = req.body;
  //data.userUuid = req.claims.uuid;

  var url = data.url ? data.url : undefined;
 
  urlLib.getMetadata(url).then(results => {
		return libMeta.mergeWithMeta(results);
	}).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get 1  
router.get("/:id", libAuthorization.AdminOrId, function(req, res) {
  var id = req.params.id;
  var userUuid = req.claims.uuid ? req.claims.uuid : undefined;

  urlLib.getById(id, userUuid).then(results => {

   //if(results && results.length>0) return libMeta.mergeWithMeta(results[0]._doc); 

		return libMeta.mergeWithMeta(results);
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get all  
router.get("/", libAuthorization.AdminOrId, function(req, res) {
  //TODO = pass in uuid for all requests
  //so only urls associated with user are returned
  //req.claims.uuid
  var userUuid = req.claims.uuid ? req.claims.uuid : undefined;

  urlLib.getAllByUser(userUuid).then(results => {
		return libMeta.mergeWithMeta(results);
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// delete 1
router.delete("/:id", libAuthorization.AdminOrId, function(req, res) {
  var id = req.params.id;
  urlLib.deleteById(id).then(results => {
		return libMeta.mergeWithMeta(results);
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

module.exports = router;