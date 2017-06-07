/*eslint-env mocha */ 
"use strict";

const userLib = require('./users'),
  testUtils = require('../utilities/test.utils'),
  chai = require('chai'),
  should = chai.should(),
  expect = require('chai').expect;

describe('users lib', function() {

    it('should create returnable array of users (no password, no id)', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: testUtils.uniqueString() + "@test.com",
        password: "testPassword"
      };

      userLib.getAll().then(users => {

          // meta
          users.should.be.a('array');

          if(users && users.length>0){
            users.forEach(function(user, i, collection) {
              testUtils.wellFormedUser(user);
            }, this);
          }
                      
        done();
      }).catch(err => {
        err.should.not.exist();
      });
    });
});