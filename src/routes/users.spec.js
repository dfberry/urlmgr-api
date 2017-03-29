/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();

describe('users', function() {

    it('should create 1 user - register', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
        password: "testPassword"
      };

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
            done();
          });
    });
    it('should get 1 user by email', function(done) {

      var agent = chai.request.agent(server)

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
        password: "testPassword"
      };

      agent.post('/v1/users/')
          .send(testUser)
          .end((err, res) => {

            // meta
            should.not.exist(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("data");
            res.body.should.have.property("commit");
            res.body.should.have.property("branch");

            //data 
            res.body.data.email.should.be.eql(testUser.email);
            res.body.data.should.not.have.property("password");

            let authUser = {
              email: testUser.email,
              password: testUser.password
            }

            // user is created, get token
            agent.post('/v1/auth')
                .send(authUser)
                .end((_err, _res) => {            

                  // meta
                  should.not.exist(err);
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property("data");
                  res.body.should.have.property("commit");
                  res.body.should.have.property("branch");

                  _res.body.data.token.length.should.be.above(200);

                  testUser.token =  _res.body.data.token;

                  // make sure entire db record is NOT returned
                  _res.body.data.should.not.have.property("revoked");

                  // get user by email returns token
                  agent.get('/v1/users/email/' + testUser.email)
                    .set('x-access-token', testUser.token)
                    .end((err2, res2) => {

                      // meta
                      should.not.exist(err2);
                      res2.should.have.status(200);
                      res2.body.should.be.a('object');
                      res2.body.should.have.property("data");
                      res2.body.should.have.property("commit");
                      res2.body.should.have.property("branch");

                      // data
                      res2.body.data.firstName.should.be.eql(testUser.firstName);
                      res2.body.data.lastName.should.be.eql(testUser.lastName);
                      res2.body.data.email.should.be.eql(testUser.email);
                      res2.body.data.should.not.have.property("password");
                      done();
                  });
              });
        });
    });
    it('should logout user', function(done) {

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

            res.body.data.email.should.be.eql(testUser.email);
            res.body.data.should.not.have.property("password");

            testUser.id = res.body.data.id;

            let authUser = {
              email: testUser.email,
              password: testUser.password
            }

            // user is created, get token
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

                  _res.body.data.token.length.should.be.above(200);

                  testUser.token =  _res.body.data.token;

                  // make sure entire db record is NOT returned
                  _res.body.data.should.not.have.property("revoked");
                        
                  // logoff
                  chai.request(server)
                  .delete('/v1/users/' + testUser.id + "/tokens")
                  .query({user: testUser.id})
                  .set('x-access-token', testUser.token)
                  .end((err3, res3) => {

                    // meta
                    should.not.exist(err3);
                    res3.should.have.status(200);
                    res3.body.should.be.a('object');
                    res3.body.should.have.property("data");
                    res3.body.should.have.property("commit");
                    res3.body.should.have.property("branch");

                    // TODO: make sure item is gone from database
                    done();
                  });
                });   
          });
    });
});