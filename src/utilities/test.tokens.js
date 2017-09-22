"use strict";

const tokensLib = require('../libs/tokens'),
  testUtils = require('./test.utils');


let TestTokens = {
  
  deleteAll: function(){
    return new Promise(function(resolve, reject) {
      try{
        tokensLib.deleteAllRaw();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = TestTokens;