"use strict";

const config = require('../../config.js'),
  express = require('express'),
  router = express.Router(),
  _ = require('underscore'),
  responseLib = require('../../libs/response.js');

let api = { route: "meta", cache:false};

// public, no auth required
router.get('/', function(req, res) {
		
  let meta = {};
  let data = {};
  
  responseLib.buildResponseSuccess(req, api, meta, data).then ( json => {
    res.status(200).send(json);
  }).catch(function(err) {
		return res.status(500).send({ error: err.message });
  });
});

module.exports = router;

