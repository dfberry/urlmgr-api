"use strict";

const express = require('express'),
  router = express.Router(),
  tagsLib = require('../libs/tags'),
  libAuthorization = require('../libs/authorization'),
  libResponse = require('../libs/response');

let api = { route: "tags"};

// get all tags grouped by count for user (user id in param)
router.get("/:id", libAuthorization.AdminOrId, function(req, res) {
  //TODO = pass in uuid for all requests
  //so only urls associated with user are returned
  //this works for admin as well since authorization checks AdminOrId
  //but the user id is passed in via the params and is guid-ish
  
  let userId = req.params.id;
  api.action="get all tags grouped by count for user (user id in param)";
  api.userUuid = userId;

  tagsLib.getByUser(api.userUuid).then(tags => {
		return libResponse.buildResponseSuccess(req, api, {}, {tags: tags});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// PUBLIC 
// get all tags - public tag cloud
router.get("/", function(req, res) {

  api.action="get all tags - public tag cloud";

  tagsLib.getAll().then(tags => {
		return libResponse.buildResponseSuccess(req, api, {}, {tags: tags});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

module.exports = router;