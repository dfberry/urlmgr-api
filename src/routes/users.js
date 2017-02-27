"use strict";

var libAuthorization = require('../libs/authorization');
var libUsers = require('../libs/users');
var express = require('express');
var router = express.Router();
var uuidV4Regex = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}';

// create 1
router.post('/',  function(req, res) {
  var data = req.body;

  libUsers.create(data)
  .then( (results) => {
    res.status(200).json(removePassword(results));
  }).catch(err => {
    res.status(500).send({ error: err.message });
  });
});

router.get("/email/:email", function(req, res) {
  var email = req.params.email;

  libUsers.getByEmail(email).then(function(results) {
    res.send(removePassword(results));
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

router.get("/:id(" + uuidV4Regex + ")", libAuthorization.AdminOrId, function(req, res) {
  var id = req.params.id;

  libUsers.get(id).then(function(results) {
    res.send(removePassword(results));
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

/* Revokes a User's token

   This supports active user logout, where it makes sense to 
   invalidate the token they were using, since it will no longer
   be available to their device. 
   
   Notes:
     *  If no token is passed then it deletes ALL the user's tokens

*/
router.delete("/:id/tokens", libAuthorization.AdminOrId, function(req, res) {
  var id = req.params.id;
  var token = req.headers['x-access-token'];
  libUsers.logout(id, token).then(function() {
    res.send();
  }).catch(function(err) {
    res.status(500).send(err);
  });
});
function removePassword(user){
    let newUserObj = JSON.parse(JSON.stringify(user));
    newUserObj.password = null;
    delete newUserObj['password'];
    return newUserObj;
}

module.exports = router;