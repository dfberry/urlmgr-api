"use strict";
//http://www.scotchmedia.com/tutorials/express/authentication/2/05

const noAuthPresented = "AuthFailure: No Authorization presented",
  notAuthorized = "AuthFailure: User is not authorized";

let authorization = {

  admin: function(req, res, next) {
    // User must make some claims
    if (!authorizationPresented(req))  throw new Error(noAuthPresented);

    // User must be in the role of Administrator
    if (!isAdmin(req)) throw new Error(notAuthorized);

    // Otherwise carry on
    next();
  },

  support: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error(noAuthPresented);
  
    // User must in the role of support
    if (!isSupport(req)) throw new Error(notAuthorized); 

    // Otherwise carry on
    next();
  },

  supportOrAdmin: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error(noAuthPresented);
  
    // User must in the role of support
    if (!isSupport(req) && !isAdmin(req)) throw new Error(notAuthorized); 

    // Otherwise carry on
    next();
  },

  viewerOrAdmin: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error(noAuthPresented);
  
    // User must in the role of support
    if (!isViewer(req) && !isAdmin(req)) throw new Error(notAuthorized);

    // Otherwise carry on
    next();
  },

  hasRole: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error(noAuthPresented);
  
    // User must in the role of support
    if (!isSupport(req) && !isAdmin(req) && !isViewer(req)) throw new Error(notAuthorized);

    // Otherwise carry on
    next();
  },

  /* Either the claims id matches the id in the param

     OR the user is an Admin

  */
  AdminOrId: function(req, res, next) {

    console.log("top of AdminOrId");
    console.log(req.headers);

     // User must makes some claims
    if (!authorizationPresented(req)) throw new Error(noAuthPresented);

    // User must either be the user or an Admin
    if (!isAdmin(req) && !isId(req)) throw new Error(notAuthorized);
  
    next();
  }
};
// claims.uuid - was decoded from token
function isId(req) {

  let uuid = req.body.user || req.query.user || req.headers['user'] || req.params['user'];

  console.log("claims uuid = " + req.claims.uuid);
  console.log("request uuid = " + uuid);

  if (req.claims.uuid === uuid) {
    console.log("isId == true");
    return true;
  }
  return false;
}

function isAdmin(req) {
  if (req.claims.role.includes('admin')) {
    console.log("isAdmin == true");
    return true;
  }
  return false;
}

function isSupport(req) {
  if (req.claims.role === 'support') return true;
  return false;
}

function isViewer(req) {
  if (req.claims.role === 'viewer') return true;
  return false;
}

function authorizationPresented(req) {
  if (req.claims) {
    //console.log("auth presented claims = " + JSON.stringify(req.claims));
    return true;
  }
  return false;
}

module.exports = authorization;
