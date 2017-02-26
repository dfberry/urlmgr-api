"use strict";

var authorization = {

  admin: function(req, res, next) {
    // User must make some claims
    if (!authorizationPresented(req)) throw new Error("No Authorization presented");

    // User must be in the role of Administrator
    if (!isAdmin(req)) throw new Error("User is not an Administrator");

    // Otherwise carry on
    next();
  },

  support: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error("No Authorization presented");
  
    // User must in the role of support
    if (!isSupport(req)) throw new Error("User is not an authorized Support technician");

    // Otherwise carry on
    next();
  },

  supportOrAdmin: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error("No Authorization presented");
  
    // User must in the role of support
    if (!isSupport(req) && !isAdmin(req)) throw new Error("User is not an authorized Support technician or Administrator");

    // Otherwise carry on
    next();
  },

  viewerOrAdmin: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error("No Authorization presented");
  
    // User must in the role of support
    if (!isViewer(req) && !isAdmin(req)) throw new Error("User is not an authorized Viewer or Administrator");

    // Otherwise carry on
    next();
  },

  hasRole: function(req, res, next) {
    // User must makes some claims
    if (!authorizationPresented(req)) throw new Error("No Authorization presented");
  
    // User must in the role of support
    if (!isSupport(req) && !isAdmin(req) && !isViewer(req)) throw new Error("User is not an authorized Viewer, Support technician or Administrator");

    // Otherwise carry on
    next();
  },

  /* Either the claims id matches the id in the param

     OR the user is an Admin

  */
  AdminOrId: function(req, res, next) {
     // User must makes some claims
    if (!authorizationPresented(req)) throw new Error("No Authorization presented");
 
    // User must either be the user or an Admin
    if (!isAdmin(req) && !isId(req)) throw new Error("User is not authorized to view this data"); 
  
    next();
  }
};

function isId(req) {
  if (req.claims.uuid === req.params.id) return true;
  return false;
}

function isAdmin(req) {
  if (req.claims.role === 'admin') return true;
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
  if (req.claims) return true;
  return false;
}

module.exports = authorization;
