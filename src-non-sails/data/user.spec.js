/*eslint-env mocha */
"use strict";

const User = require("./user");
var chai = require('chai');
let should = chai.should();
let expect = chai.expect;

describe('user model ', function() {

    it('should save 1 user', function(done){

      let timestamp = new Date;

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
        password: "testPassword"
      };

      var userObj = new User(testUser);

      userObj.save((err, _user) =>{
         expect(err).to.be.null;
         _user.email.should.be.eql(testUser.email);
         done();
      });
    
    });
});
