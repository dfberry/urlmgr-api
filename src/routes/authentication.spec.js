/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../server.js'),
  testUtils = require('../utilities/test.utils'),
  should = chai.should();

chai.use(chaiHttp);
 

describe('authentication', function() {

    it('should authenticate 1 user to password - login', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
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

                  // meta
                  should.not.exist(_err);
                  testUtils.expectSuccessResponse(res);

                  // data
                  testUtils.wellFormedUser(_res.body.data.user);
                  _res.body.data.user.should.have.property("token");
                  _res.body.data.user.token.length.should.be.above(200);

                  done();
                });   
          });
    });

    it('should NOT authenticate 1 user to bad password', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
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

            // data
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

                  _res.status.should.be.eq(422);
                  _err.message.should.be.eq("Unprocessable Entity");
                  done();
                });   
          });
    });
});