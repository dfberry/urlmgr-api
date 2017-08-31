"use strict";

const express = require('express'),
  config = require('../config.js'),
  router = express.Router(),
  urlLib = require('../libs/urls'),
  libAuthorization = require('../libs/authorization'),
  libResponse = require('../libs/response');

let api = { route: "url"};

// create 1
router.post('/', libAuthorization.AdminOrId, function(req, res) {
  // { userUuid: 'xcv', url: 'http://sdfsf'}
  let data = req.body;
  data.userUuid = req.claims.uuid;

  api.action="create";

  urlLib.createWithMeta(data).then(url => {
		return libResponse.buildResponseSuccess(req, api, {}, {url: url});
	}).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// PUBLIC 
// get all urls by tag[s] - click on tag item, get these results
router.post("/tags", function(req, res) {
  let data = req.body;
  let tags = data.tags ? data.tags : undefined;
  
  api.action="get urls by tag[s] - public";

  urlLib.getAllByTags(tags).then(urls => {
    return libResponse.buildResponseSuccess(req, api, {}, {urls: urls});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get n urls by most recent date entered for public consumption
router.get("/public", function(req, res) {
  let n = req.params.n;
  if (!n)  n = (config && config.thinkingabout && config.thinkingabout.length) ? config.thinkingabout.length : 5;

  let publicThinkingAboutEmailaddress = (config && config.thinkingabout && config.thinkingabout.email) ? config.thinkingabout.email : undefined;
  
  if (!publicThinkingAboutEmailaddress) return res.status(500).send("public thinkingabout account not set");
  
  api.action="public";

  urlLib.public(publicThinkingAboutEmailaddress, n).then(url => {
		return libResponse.buildResponseSuccess(req, api, {}, {urls: url});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

router.post('/meta', libAuthorization.AdminOrId, function(req, res) {
  let data = req.body;

  let url = data.url ? data.url : undefined;
 
  api.action="get url's feeds and title";

  urlLib.getMetadata(url).then(results => {
		return libResponse.buildResponseSuccess(req, api, {}, {url: results});
	}).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get 1  
router.get("/:id", libAuthorization.AdminOrId, function(req, res) {
  let urlId = req.params.id;
  let userUuid = req.claims.uuid ? req.claims.uuid : undefined;

  api.action="get by id";

  urlLib.getById(urlId, userUuid).then(url => {
		return libResponse.buildResponseSuccess(req, api, {}, {url: url});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get all for user id by credentials from token 
router.get("/", libAuthorization.AdminOrId, function(req, res) {
  //TODO = pass in uuid for all requests
  //so only urls associated with user are returned
  //req.claims.uuid
  let userUuid = req.claims.uuid ? req.claims.uuid : undefined;

  api.action="get all by user";
  api.userUuid = userUuid;

  urlLib.getAllByUser(api.userUuid).then(urls => {
		return libResponse.buildResponseSuccess(req, api, {}, {urls: urls});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// delete 1
router.delete("/:id", libAuthorization.AdminOrId, function(req, res) {
  let id = req.params.id;

  api.action="delete by id";

  urlLib.deleteById(id).then(results => {
		return libResponse.buildResponseSuccess(req, api, {}, {url: results});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

module.exports = router;