"use strict";

const Promise = require("bluebird"),
  git = require('./git');
  
const Meta = {
  git: function (){
    return git.gitInfo().then(result => {
      return result;
    }).catch(err => {
      throw err;
    });
  }
};

module.exports = Meta;