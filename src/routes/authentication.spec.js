/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();

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
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("data");
            res.body.should.have.property("commit");
            res.body.should.have.property("branch");

            res.body.data.email.should.be.eql(testUser.email);

            testUser.id = res.body.id;

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
                  _res.should.have.status(200);
                  _res.body.should.be.a('object');
                  _res.body.should.have.property("data");
                  _res.body.should.have.property("commit");
                  _res.body.should.have.property("branch");

                  // data
                  _res.body.data.should.have.property("id");
                  _res.body.data.should.have.property("firstName");
                  _res.body.data.should.have.property("lastName");
                  _res.body.data.should.have.property("email");
                  _res.body.data.should.have.property("lastLogin");
                  _res.body.data.should.have.property("token");
                  _res.body.data.token.length.should.be.above(200);

                  _res.body.should.not.have.property("password");
                  _res.body.should.not.have.property("revoked");

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
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("data");
            res.body.should.have.property("commit");
            res.body.should.have.property("branch");

            // data
            res.body.data.email.should.be.eql(testUser.email);
            res.body.data.should.not.have.property("password");

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