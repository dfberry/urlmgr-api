"use strict";

const tokensLib = require('../libs/tokens'),
  testUtils = require('./test.utils');


let TestTokens = {

  deleteAll: function(){
    tokensLib.deleteAllRaw();
  }
}
module.exports = TestTokens;