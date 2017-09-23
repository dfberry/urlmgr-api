"use strict";

const authorization = require('./authorization'),
  express = require('express'),
  router = express.Router(),
  uuidV4Regex = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4{1}[a-fA-F0-9]{3}-[89abAB]{1}[a-fA-F0-9]{3}-[a-fA-F0-9]{12}';

let api = { route: "user", cache:false};

// create 1 - registration
router.post('/',  function(req, res) {
  let data = req.body;

  api.action="create";

  req.app.locals.libraries.user.create(data).then( userObj => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {user: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(err => {
    if(err.message.indexOf("duplicate key error collection")) {
      let meta={},data={};
      api.error = { type: "registration failure", message: "Email already exists"};
      
      return req.app.locals.libraries.response.buildResponse(req, api, meta, data).then( obj => {
        // email already registered
        return res.status(403).json(obj);
      }).catch(err => {
        res.status(500).send(err);
      });
      
    }
    return res.status(500).send({ error: err.message });
  });
});

// reset password 
router.patch('/password/reset', authorization.AdminOrId,  function(req, res) {
  let data = req.body;
  // just email and password

  api.action="reset password";

  req.app.locals.libraries.user.resetPassword(data).then( userObj => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {user: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(err => {
      let meta={},data={};
      api.error = { type: "reset password failure", message: JSON.stringify(err)};
      return req.app.locals.libraries.response.buildResponse(req, api, meta, data).then( obj => {
        // email already registered
        return res.status(403).json(obj);
      }).catch(err => {
        res.status(500).send(err);
      });
  });
});

// TBD: when do I use this?
router.get("/email/:email", authorization.AdminOrId, function(req, res) {
  
  let email = req.params.email;

  api.action = "get user by email";

  req.app.locals.libraries.user.getByEmail(email).then( userObj => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {user: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get all
router.get("/", authorization.admin, function(req, res) {

  api.action = "get all users";

  req.app.locals.libraries.user.getAll().then( usersObj => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {users: usersObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

// get by id
router.get("/:id(" + uuidV4Regex + ")", authorization.AdminOrId, function(req, res) {
  //let id = req.params.id;
  let id = req.claims.uuid ? req.claims.uuid : undefined;
  
  api.action = "get user by id";

  req.app.locals.libraries.user.get(id).then( userObj => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {users: userObj});
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
router.delete("/:id/tokens", authorization.AdminOrId, function(req, res) {
  let id = req.params.id;

  api.action = "delete user by token";

  let token = req.headers['x-access-token'];

  req.app.locals.libraries.user.logout(id, token).then( userObj => {
    return req.app.locals.libraries.response.buildResponseSuccess(req, api, {}, {users: userObj});
  }).then( finalObj => {
    res.status(200).json(finalObj);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;