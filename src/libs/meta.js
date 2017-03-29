"use strict";

var Promise = require("bluebird");
var git = require('./git');
var _ = require('underscore');

var Meta = {
  
  /**
   * returns json of 
   *  git commit
   *  git branch
   */
  git: function (){

       return new Promise(function(resolve, reject) {

          var version = {
            branch: "",
            commit: ""
          };

          git.gitBranch()
          .then(branch => {
            version.branch = branch;
            return git.gitCommit(branch);
          }).then(commit => {
            version.commit = commit;
           resolve(version);
          }).catch(err => {
            reject(err);
          });

       });
  },
  mergeWithMeta: function(json){
    var self = this;
    return new Promise(function(resolve, reject) {

      if(!json)reject("parameter is empty");

      json = { data: json};

      self.git().then(meta => {
        resolve((_.extend({}, json, meta)));
      }).catch(reject);
    });
  },
  removePassword: function(jsonObj){
    Object.keys(jsonObj).forEach(function(key) {
      if(key === 'password') delete jsonObj[key]; 
    });
    return jsonObj;
  }
};

module.exports = Meta;