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

      return (response);

    }).catch((err) => {

      throw(err);
    });
  },
  buildResponseFailure: function(req, api, meta, data){

    return this.buildResponse(req, api, meta, data).then(response => {

      response.status = "failure";
      response.state = 0;

      return (response);

    }).catch((err) => {

      throw(err);
    });
  },
  buildResponse: function(req, api, meta, data){


      if(!req || !api) {

        return Promise.reject("missing mergable results");
      }

      let responseJson = {};
      responseJson.api = api;
      responseJson.data = data; 

      return metaLib.git().then(results => {

        // add git commit and branch, db container name
        let verMongo = req.app.get('ver-mongo');
        responseJson.meta = _.extend(meta, results, { container: req.app.locals.container, mver: verMongo});
        return (responseJson);
      }).catch((err) => {
        throw(err);
      });
  
  }
}

module.exports = Response;

