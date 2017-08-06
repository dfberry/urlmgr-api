"use strict";

const Promise = require("bluebird"),
metaLib = require('./meta'),
_ = require('underscore');

let Response = {
  /**
   * 
   */
  buildResponseSuccess: function(req, api, meta, data){

    return this.buildResponse(req, api, meta, data).then(response => {

      response.status = "success";
      response.state = 1;

      return Promise.resolve(response);

    }).catch(err => {return Promise.reject(err)});
  },
  buildResponseFailure: function(req, api, meta, data){

    return this.buildResponse(req, api, meta, data).then(response => {

      response.status = "failure";
      response.state = 0;

      return Promise.resolve(response);

      }).catch(err => {return Promise.reject(err)});
  },
  buildResponse: function(req, api, meta, data){

    return new Promise(function(resolve, reject) {

      if(!req || !api) reject("missing mergable results");

      let responseJson = {};
      responseJson.api = api;
      responseJson.data = data; 

      metaLib.git().then(gitCommentAndBranch => {

        // add git commit and branch, db container name
        responseJson.meta = _.extend(meta, gitCommentAndBranch, { container: req.app.locals.container});

        resolve(responseJson);
      }).catch((err) => {
        reject(err);
      });
    });    
  }
}

module.exports = Response;

