"use strict";

var express = require('express');
var router = express.Router();
var usersLib = require('../libs/users');

// create 1
router.post('/',  function(req, res) {
  var data = req.body;

  usersLib.create(data)
  .then( (results) => {
    res.status(200).json(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });
});

// get 1  
router.get("/:id",  function(req, res) {
  var id = req.params.id;

  usersLib.getById(id)
  .then( (results) => {
    res.status(200).send(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });

});

// get 1  
router.get("/email/:email",  function(req, res) {
  var email = req.params.email;

  usersLib.getByEmail(email)
  .then( (results) => {
    res.status(200).send(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });

});


// Revokes a User's token
/*
router.delete("/:id/tokens",  function(req, res) {
  var id = req.params.id;
  var token = req.query.token;

  usersLib.logout(req.db, id, token)
  .then( results => {
    res.status(200).json(results);
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });

});
*/

module.exports = router;