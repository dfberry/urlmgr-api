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
    testTokens.deleteAll();
    done();
  });



    it('should create token', function(done) {

      let oneUser;

      testUsers.createUser().then(user => {  

        oneUser = user;

        // create 2 tokens for user
        let token1 = authLib.getToken(user.email, user, jwt);
        let token2 = authLib.getToken(user.email, user, jwt);

        // insert tokens for user
        let insert1 = tokenLib.insert(user, token1);
        let insert2 = tokenLib.insert(user, token2);

        return Promise.all([insert1, insert2]);
      }).then(usersWithTokens => {

        // should return user object with token object
        testUtils.wellFormedToken(usersWithTokens[0]);
        testUtils.wellFormedToken(usersWithTokens[1]);

        // should return 2 tokens
        return tokenLib.getByUserId(oneUser);
      }).then(tokens => {

        tokens.length.should.be.eql(2);
        tokens[0].userUuid = oneUser.id;
        tokens[1].userUuid = oneUser.id;
        tokens[0].id.should.not.be.eql(tokens[1].id);

        tokens.forEach((token, id, collection) => {
            testUtils.wellFormedToken(token);
        });

        done();
      }).catch(err => {  
        done(err);
      });

    });

});