"use strict";

var express = require('express');
var router = express.Router();
var urlLib = require('../libs/urls');

// create 1
router.post('/',  function(req, res) {
  var data = req.body;

  urlLib.create(data)
  .then( (results) => {
    res.status(200).json(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });
});

// get 1  
router.get("/:id",  function(req, res) {
  var id = req.params.id;

  urlLib.getById(id)
  .then( (results) => {
    res.status(200).send();
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });

});

// get all  
router.get("/",  function(req, res) {
  urlLib.getAll()
  .then( (results) => {
    res.status(200).json(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });

});

// delete 1
router.delete("/:id",  function(req, res) {
  var id = req.params.id;
  urlLib.deleteById(id)
  .then( results => {
    res.status(200).json(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });

});

module.exports = router;