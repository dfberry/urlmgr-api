"use strict";

const express = require('express'),
  router = express.Router(),
  authorization = require('./authorization');

let api = { route: "cache", cache:false};

// public, no auth required
router.get('/', function(req, res) {
		
  let meta = {};
  let data = { cache:{action:'getall'}};

  let cacheLib = req.app.locals.cache;
  data.cache.values = getCache(cacheLib);
  
  req.app.locals.libraries.response.buildResponseSuccess(req, api, meta, data).then ( json => {
    res.status(200).send(json);
  }).catch(function(err) {
		return res.status(500).send({ error: err.message });
  });
});

router.delete('/', authorization.admin, function(req, res) {
  
  let meta = {};
  let data = { cache:{action:'clear'}};

  let cacheLib = req.app.locals.cache;

  if(cacheLib){
    cacheLib.clear();
    data.cache.values = getCache(cacheLib);
  }

  req.locals.libraries.response.buildResponseSuccess(req, api, meta, data).then ( json => {
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

