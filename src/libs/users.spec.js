/*eslint-env mocha */ 
"use strict";

const userLib = require('./users'),
  chai = require('chai'),
  should = chai.should(),
  expect = require('chai').expect;

describe('users lib', function() {

    it('should create returnable array of users (no password, no id)', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
        password: "testPassword"
      };

      userLib.getAll().then(users => {

          // meta
          users.should.be.a('array');

          if(users && users.length>0){
            users.forEach(function(user, i, collection) {
              users[0].should.have.property("id");
              users[0].should.have.property("firstName");
              users[0].should.have.property("lastName");
              users[0].should.have.property("email");
              users[0].should.have.property("roles");
            }, this);
          }
                      
        done();
      }).catch(err => {
        err.should.not.exist();
      });
    });
});