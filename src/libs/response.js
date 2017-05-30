"use strict";

var Promise = require("bluebird");
var metaLib = require('./meta');
var _ = require('underscore');

var Response = {
  /**
   * 
   */
  buildResponseSuccess: function(req, api, meta, data){

    return this.buildResponse(req, api, meta, data).then(response => {

      response.status = "success";
      response.state = 1;

      return new Promise.resolve(response);

      }).catch(err => {return err});
  },
  buildFailureSuccess: function(req, api, meta, data){

    return this.buildResponse(req, api, meta, data).then(response => {

      response.status = "failure";
      response.state = 0;

      return new Promise.resolve(response);

      }).catch(err => {return err});
  },
  buildResponse: function(req, api, meta, data){

    return new Promise(function(resolve, reject) {

      if(!req || !api) reject("no mergable results");

      let responseJson = {};
      responseJson.api = api;
      responseJson.data = data; 

      metaLib.git().then(gitCommentAndBranch => {

        // add git commit and branch, db container name
        responseJson.meta = _.extend(meta, gitCommentAndBranch, { container: req.app.locals.container});

        resolve(responseJson);
      }).catch((err) => {
        console.log("err");
        console.log(err);
        reject(err);
      });
    });    
  }
}

module.exports = Response;

