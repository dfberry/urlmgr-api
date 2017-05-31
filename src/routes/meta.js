"use strict";

let config = require('../config/config.json');
let express = require('express');
let router = express.Router();
let _ = require('underscore');
let responseLib = require('../libs/response.js');

let api = { route: "meta"};

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

