"use strict";

const express = require('express'),
  router = express.Router();

let api = { route: "meta", cache:false};

// public, no auth required
router.get('/', function(req, res) {
		
  let meta = {};
  let data = {};
  
  req.app.locals.libraries.response.buildResponseSuccess(req, api, meta, data).then ( json => {
    res.status(200).send(json);
  }).catch(function(err) {
		return res.status(500).send({ error: err.message });
  });
});

module.exports = router;

