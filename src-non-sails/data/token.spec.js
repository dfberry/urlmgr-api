/*eslint-env mocha */
"use strict";
const sinon = require('sinon');
const Token = require("./token");
const User = require("./user");
var chai = require('chai');
let should = chai.should();
let expect = chai.expect;

describe('token', function() {

  it('should create 1 token', function(done) {

    let timestamp = new Date;

    let testUser = {
      lastName: "berry",
      firstName: "dina",
      email: Math.floor(new Date().getTime()) + "@test.com",
      password: "testPassword"
    };

    var userObj = new User(testUser);

    userObj.save((err, _user) => {
      expect(err).to.be.null;
      _user.id.should.not.be.null;

      var testToken = {
        userUuid: _user.id
      }

      var tokenObj = new Token(testToken);

      tokenObj.save((err, _token) => {
        expect(err).to.be.null;
        _token.id.should.not.be.null;

        //TODO: comparing uuids as strings is not right
        expect(String(_token.userUuid)===String(testToken.userUuid)).to.be.true;
        done();
      });
    });
  });
  /*
  it('should revoke token', function(done) {

    let timestamp = new Date;

    let testUser = {
      lastName: "berry",
      firstName: "dina",
      email: Math.floor(new Date().getTime()) + "@test.com",
      password: "testPassword"
    };

    var userObj = new User(testUser);

    userObj.save((err, _user) => {
      expect(err).to.be.null;
      _user.id.should.not.be.null;

      var testToken = {
        userUuid: _user.id
      }

      var tokenObj = new Token(testToken);

      tokenObj.save((err, _token) => {
        expect(err).to.be.null;
        _token.id.should.not.be.null;

        //TODO: comparing uuids as strings is not right
        expect(String(_token.userUuid)===String(testToken.userUuid)).to.be.true;

        Token.revoke(_token.userUuid, (err, status ) => {

          if(err)done(err);

          Token.find({where: {userUuid: _user.id}}, (_err, _status) => {
            if(_err)done(_err);
            expect(_err).to.be.null;
            done();
          })
        });
      });
    });
    
  });*/
});
