"use strict";

const express = require('express'),
  router = express.Router(),
  authorization = require('./authorization');

// milliseconds
let oneMinute = 60000;
let cacheTimeMs = 10 * oneMinute; // 10 minute cache

let api = { route: "url", cache:false};

// create 1
router.post('/', authorization.AdminOrId, function(req, res) {

  // { userUuid: 'xcv', url: 'http://sdfsf'}
  let data = req.body;
  data.userUuid = req.claims.uuid;

  api.action="create";

  req.app.locals.libraries.url.createWithMeta(data).then(url => {
		return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {url: url});
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

  req.app.locals.libraries.url.getAllByTags(tags).then(urls => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {urls: urls});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get n urls by most recent date entered for public consumption
router.get("/public", function(req, res) {
  let n = req.params.n;
  if (!n)  n = (req.app.locals.config && req.app.locals.config.thinkingabout && req.app.locals.config.thinkingabout.length) ? req.app.locals.config.thinkingabout.length : 5;

  let publicThinkingAboutEmailaddress = (req.app.locals.config && req.app.locals.config.thinkingabout && req.app.locals.config.thinkingabout.email) ? req.app.locals.config.thinkingabout.email : undefined;
  
  if (!publicThinkingAboutEmailaddress) return res.status(500).send("public thinkingabout account not set");
  
  api.action="public";

  // get cache
  let cacheLib = req.app.locals.cache;
  let urlCache = cacheLib ? cacheLib.get("urls"): undefined;
  api.cache = urlCache ? true: false;  
  cacheTimeMs = (urlCache && req.app.locals.config && req.app.locals.config.cacheMilliseconds) ? req.app.locals.config.cacheTimeMs : cacheTimeMs;

  let pUrls = urlCache ? Promise.resolve(urlCache): req.app.locals.libraries.url.public(publicThinkingAboutEmailaddress, n);

  pUrls.then(url => {
    if(!urlCache && url && cacheTimeMs) cacheLib.put("urls",url, cacheTimeMs);
		return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {urls: url});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

router.post('/meta', authorization.AdminOrId, function(req, res) {
  let data = req.body;

  let url = data.url ? data.url : undefined;
 
  api.action="get url's feeds and title";

  req.app.locals.libraries.url.getMetadata(url).then(results => {
		return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {url: results});
	}).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get 1  
router.get("/:id", authorization.AdminOrId, function(req, res) {
  let urlId = req.params.id;
  let userUuid = req.claims.uuid ? req.claims.uuid : undefined;

  api.action="get by id";

  req.app.locals.libraries.url.getById(urlId, userUuid).then(url => {
		return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {url: url});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// get all for user id by credentials from token 
router.get("/", authorization.AdminOrId, function(req, res) {
  //TODO = pass in uuid for all requests
  //so only urls associated with user are returned
  //req.claims.uuid
  let userUuid = req.claims.uuid ? req.claims.uuid : undefined;

  api.action="get all by user";
  api.userUuid = userUuid;

  req.app.locals.libraries.url.getAllByUser(api.userUuid).then(urls => {
		return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {urls: urls});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

// delete 1
router.delete("/:id", authorization.AdminOrId, function(req, res) {
  let id = req.params.id;

  api.action="delete by id";

  req.app.locals.libraries.url.deleteById(id).then(results => {
		return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {url: results});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });

});

module.exports = router;