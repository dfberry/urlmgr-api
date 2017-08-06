"use strict";

const express = require('express'),
  router = express.Router(),
  tagsLib = require('../libs/tags'),
  libAuthorization = require('../libs/authorization'),
  libResponse = require('../libs/response');

let api = { route: "tags"};

// PUBLIC 
// get all tags - public tag cloud
router.get("/all", function(req, res) {

  api.action="get all tags - public tag cloud";

  tagsLib.getAll().then(tags => {
		return libResponse.buildResponseSuccess(req, api, {}, {tags: tags});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get all tags grouped by count for user (user id in param)
router.get("/user/:user", libAuthorization.AdminOrId, function(req, res) {
  //TODO = pass in uuid for all requests
  //so only tags associated with user are returned
  //this works for admin as well since authorization checks AdminOrId
  //but the user id is passed in via the params and is guid-ish

  let userId = req.params.user;

  api.action="get all tags grouped by count for user (user id in param)";
  api.userUuid = userId;

  tagsLib.getByUserId(api.userUuid).then(tags => {
		return libResponse.buildResponseSuccess(req, api, {}, {tags: tags});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

module.exports = router;