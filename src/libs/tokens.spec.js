 /*eslint-env mocha */
"use strict";

const chai = require('chai'),
  should = chai.should(),
  testUtils = require('../utilities/test.utils'),
  testUsers = require('../utilities/test.users'),
  testTokens = require('../utilities/test.tokens'),
  authLib = require('./authentication'),
  tokenLib = require('./tokens');

describe('tokens lib', function() {

  let jwt = {
    "issuer": "test.dfberry.io",
    "secret": "Test1234"
  };

  beforeEach(function(done) {
    testUsers.deleteAllUsers();
    testTokens.deleteAllRaw();
    done();
  });



    it.only('should create token', function(done) {

      let oneUser;

      testUsers.createUser().then(user => {  

        oneUser = user

        let token1 = authLib.getToken(user.email, user, jwt);
        let token2 = authLib.getToken(user.email, user, jwt);

        //console.log("token1");
        //console.log(token1);

        //console.log("token2");
        //console.log(token2);

        let insert1 = tokenLib.insert(user, token1);
        let insert2 = tokenLib.insert(user, token2);

        return Promise.all([insert1, insert2]);
      }).then(([usersWithTokens]) => {
        testUtils.wellFormedUser(usersWithTokens[0]);
        testUtils.wellFormedUser(usersWithTokens[1]);
        //console.log(usersWithTokens);
        return tokenLib.getByUserId(oneUser.id);
      }).then(tokens => {
        console.log("\n\r final tokens array");
        console.log(tokens);
        done();
      }).catch(err => {  
        console.log(err);
        done(err);
      });

    });

});