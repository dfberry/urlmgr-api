"use strict";
var exec = require('child_process').exec;

// "path/to/.git/refs/head<branch name>"

var Promise = require("bluebird");
//var fs = require("fs");

var Git = {
  
gitCommit: function (){

       return new Promise(function(resolve, reject) {
        //http://stackoverflow.com/questions/19176359/how-to-get-the-last-commit-id-of-a-remote-repo-using-curl-like-command
        var path = "git log -n1 --format='%h'";

        exec(path, (error, stdout, stderr) => {
          if (error) reject(error);
          if (stderr) reject(stderr);
          resolve(stdout.trim())
        });
       });
  },
  

  gitBranch: function(){
       return new Promise(function(resolve, reject) {

        exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
          if (error) reject(error);
          if (stderr) reject(stderr);
          resolve(stdout.trim())
        });
    });
  }

};

module.exports = Git;