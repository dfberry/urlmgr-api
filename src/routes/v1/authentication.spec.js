/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../server.js'),
  testUtils = require('../../utilities/test.utils'),
  testUsers = require('../../utilities/test.users'),
  should = chai.should();

chai.use(chaiHttp);
 

describe('route v1 authentication', function() {

    beforeEach(function(done) {
      testUsers.deleteAllUsers().then( () => {
        done();
      }).catch( (err) => {
        done(err);
      });
    });

    it('should authenticate 1 user to password - login', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: testUtils.uniqueString() + "@test.com",
        password: "testPassword"
      };

      // create user
      chai.request(server)
          .post('/v1/users')
          .send(testUser)
          .end((err, res) => {

            // success must have
            should.not.exist(err);
            testUtils.expectSuccessResponse(res);

            res.body.data.user.email.should.be.eql(testUser.email);

            testUser.id = res.body.data.user.id;

            let authUser = {
              email: testUser.email,
              password: testUser.password
            }

            // user is created, now authenticate user back with same password
            chai.request(server)
                .post('/v1/auth')
                .send(authUser)
                .end((_err, _res) => {   

                  should.not.exist(_err);
                  testUtils.expectSuccessResponse(_res);
                  testUtils.wellFormedUser(_res.body.data.user);

                  done();
                });   
          });
    });

    it('should NOT authenticate 1 user to bad password', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: testUtils.uniqueString() + "@test.com",
        password: "testPassword"
      };

      // create user
      chai.request(server)
          .post('/v1/users')
          .send(testUser)
          .end((err, res) => {

            // meta
            should.not.exist(err);
            testUtils.expectSuccessResponse(res);
            res.body.data.user.email.should.be.eql(testUser.email);
            testUtils.wellFormedUser(res.body.data.user);

            let authUser = {
              email: testUser.email,
              password: "badPassword"
            }

            // user is created, now authenticate user back to same password
            chai.request(server)
                .post('/v1/auth')
                .send(authUser)
                .end((_err, _res) => {  
                  debugger;
                  _res.status.should.be.eq(422);
                  _err.message.should.be.eq("Unprocessable Entity");
                  done();
                });   
          });
    });

    it('should NOT authenticate 1 user that is not in db', function(done) {

      let authUser = {
        email: "userNotInDatabase@test.com",
        password: "testPassword"
      }

      // user is created, now authenticate user back to same password
      chai.request(server)
          .post('/v1/auth')
          .send(authUser)
          .end((_err, _res) => {  

                _res.status.should.be.eq(422);
                should.exist(_err);
                _res.body.api.error.message.should.be.eq("User doesn\'t exist - gbe");
                
                done();
          });   
    });
    it('should NOT authenticate 1 user if user or password is not string', function(done) {

      // json mongodb injection vulnerability

      let authUser = "user[$regex]=cd&pass=abc123";

      // user is created, now authenticate user back to same password
      chai.request(server)
          .post('/v1/auth')
          .send(authUser)
          .end((_err, _res) => {  

                _res.status.should.be.eq(422);
                should.exist(_err);

                //TBD: this is the wrong error message but the hack was stopped
                _res.body.error.should.be.eq("user or password is empty");
                
                done();
          });   
    });
});