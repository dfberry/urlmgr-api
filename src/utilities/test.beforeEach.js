"use strict";

const tokens = require('./test.tokens'),
  urls = require('./test.urls'),
  users = require('./test.users');





let BeforeEachTest = {
  
  clearOutDB: function() {

    let pUrls = urls.deleteAllUrls();
    let pUsers = users.deleteAllUsers();
    let pTokens = tokens.deleteAll();
    var printResult = (results) => {console.log("Results = ", results)};
    var errHandler = (results) => {console.log("Error Results = ", results); throw(results);};

    // See the order of promises. Final result will be according to it
    return Promise.all([pUrls,pUsers,pTokens]).then(printResult).catch(errHandler);
  }  
}
module.exports = BeforeEachTest;