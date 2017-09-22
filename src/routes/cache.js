"use strict";

const config = require('../config.js'),
  express = require('express'),
  router = express.Router(),
  _ = require('underscore'),
  libAuthorization = require('../libs/authorization'),
  responseLib = require('../libs/response.js');

let api = { route: "cache", cache:false};

// public, no auth required
router.get('/', function(req, res) {
		
  let meta = {};
  let data = { cache:{action:'getall'}};

  let cacheLib = req.app.locals.cache;
  data.cache.values = getCache(cacheLib);
  
  responseLib.buildResponseSuccess(req, api, meta, data).then ( json => {
    res.status(200).send(json);
  }).catch(function(err) {
		return res.status(500).send({ error: err.message });
  });
});

router.delete('/', libAuthorization.admin, function(req, res) {
  
  let meta = {};
  let data = { cache:{action:'clear'}};

  let cacheLib = req.app.locals.cache;

  if(cacheLib){
    cacheLib.clear();
    data.cache.values = getCache(cacheLib);
  }

  responseLib.buildResponseSuccess(req, api, meta, data).then ( json => {
    res.status(200).send(json);
  }).catch(function(err) {
    return res.status(500).send({ error: err.message });
  });
});

function getCache(cacheLib){
  
    let cache = {};
  
    if(cacheLib){
  
      let urls = cacheLib.get("urls");
      let tags = cacheLib.get("tags");
  
      if(urls) cache.urls = urls;
      if(tags) cache.tags = tags;
    }
    return cache;
}
module.exports = router;

