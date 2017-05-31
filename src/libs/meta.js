"use strict";

const Promise = require("bluebird"),
  git = require('./git');
  
const Meta = {
  
  /**
   * returns json of 
   *  git commit
   *  git branch
   */
  git: function (){
    return new Promise(function(resolve, reject) {
      let version = {branch: "",commit: ""};

      git.gitBranch().then(branch => {
        version.branch = branch;
        return git.gitCommit(branch);
      }).then(commit => {
        version.commit = commit;
        resolve(version);
      }).catch(reject);
    });
  }
};

module.exports = Meta;