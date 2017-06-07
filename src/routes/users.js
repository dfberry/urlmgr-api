"use strict";

const libAuthorization = require('../libs/authorization'),
  libUsers = require('../libs/users'),
  express = require('express'),
  router = express.Router(),
  uuidV4Regex = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}',
  responseLib = require('../libs/response.js');

let api = { route: "user"};

// create 1 - registration
router.post('/',  function(req, res) {
  let data = req.body;

  api.action="create";

  libUsers.create(data).then( userObj => {
    return responseLib.buildResponseSuccess(req, api, {}, {user: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(err => {
    if(err.message.indexOf("duplicate key error collection")) {
      let meta={},data={};
      api.error = { type: "registration failure", message: "Email already exists"};
      
      return responseLib.buildResponse(req, api, meta, data).then( obj => {
        // email already registered
        return res.status(403).json(obj);
      }).catch(err => {
        res.status(500).send(err);
      });
      
    }
    return res.status(500).send({ error: err.message });
  });
});
// TBD: when do I use this?
router.get("/email/:email", libAuthorization.AdminOrId, function(req, res) {
  
  let email = req.params.email;

  api.action = "get user by email";

  libUsers.getByEmail(email).then( userObj => {
    return responseLib.buildResponseSuccess(req, api, {}, {user: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get all
router.get("/", libAuthorization.admin, function(req, res) {

  api.action = "get all users";

  libUsers.getAll().then( usersObj => {
    return responseLib.buildResponseSuccess(req, api, {}, {users: usersObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get by id
router.get("/:id(" + uuidV4Regex + ")", libAuthorization.AdminOrId, function(req, res) {
  //let id = req.params.id;
  let id = req.claims.uuid ? req.claims.uuid : undefined;
  
  api.action = "get user by id";

  libUsers.get(id).then( userObj => {
    return responseLib.buildResponseSuccess(req, api, {}, {users: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
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
  let id = req.params.id;

  api.action = "delete user by token";

  let token = req.headers['x-access-token'];

  libUsers.logout(id, token).then( userObj => {
    return responseLib.buildResponseSuccess(req, api, {}, {users: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;