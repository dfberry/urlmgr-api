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

};

module.exports = Meta;