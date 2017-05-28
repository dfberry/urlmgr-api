"use strict";

var config = require('../config/config.json');
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var responseLib = require('../libs/response.js');

var api = { route: "meta"};

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

