"use strict";
const exec = require('child_process').exec,
  Promise = require("bluebird");

let Git = {
  // { commit: 'xxx', branch: 'yyy'}
  gitInfo: function() {
    let pCommit = this.gitCommit();
    let pBranch = this.gitBranch();
    return Promise.all([pCommit, pBranch]).then(results => {
      return {commit: results[0], branch: results[1]};
    }).catch(err => {
      throw err;
    });
  },
  gitCommit: function (){

    return new Promise(function(resolve, reject) {
      //http://stackoverflow.com/questions/19176359/how-to-get-the-last-commit-id-of-a-remote-repo-using-curl-like-command
      let path = "git log -n1 --format='%h'";

      exec(path, (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) return reject(stderr);

        return resolve(stdout.trim())
      });
    });
  },
  gitBranch: function(){

    return new Promise(function(resolve, reject) {

      exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) return reject(stderr);

        return resolve(stdout.trim())
      });
    });
  }/*

  function for commit date
  git show -s --format=%ci 82a5d19f
  or change to use npm package https://github.com/rwjblue/git-repo-info

  */

};

module.exports = Git;