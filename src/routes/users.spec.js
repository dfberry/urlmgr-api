/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');
const testUtils = require('../utilities/test.utils');
const testUsers = require('../utilities/test.users');

chai.use(chaiHttp);
let should = chai.should();
var expect = require('chai').expect;


describe('users', function() {

    beforeEach(function(done) {
      testUsers.deleteAllUsers();
      done();
    });

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

            testUtils.expectSuccessResponse(res);

            res.body.data.user.email.should.be.eql(testUser.email);
            res.body.data.user.roles.should.have.length(1);
            res.body.data.user.roles[0].should.be.eql('user');
            done();
          });
    });
    it('should create 1 administrator  & get auth token - register & auth', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
        password: "testPassword",
        roles:['admin','user']
      };

      chai.request(server)
          .post('/v1/users')
          .send(testUser)
          .end((err, res) => {

            should.not.exist(err);
            testUtils.expectSuccessResponse(res);

            res.body.data.user.email.should.be.eql(testUser.email);
            expect(res.body.data.user.roles.sort()).to.deep.equal(['admin','user']);

            // build obj to get authentication token
            let authUser = {
              email: testUser.email,
              password: testUser.password
            }

            var agent = chai.request.agent(server);
            agent.post('/v1/auth')
                .send(authUser)
                .end((_err, _res) => {            

                  testUtils.expectSuccessResponse(_res);

                  _res.body.data.user.email.should.be.eql(testUser.email);

                  done();
                });
          });
    });
    it('should get 1 user by email', function(done) {

      let user=undefined;
      let isAdmin=true;
      var agent = chai.request.agent(server);

      testUsers.createAuthenticatedUser(user, !isAdmin).then(user => {
 
        // get user by email returns token
        agent.get('/v1/users/email/' + user.email)
          .set('x-access-token', user.token)
          .end((err2, res2) => {

            // meta
            should.not.exist(err2);
            testUtils.expectSuccessResponse(res2);

            // data
            res2.body.data.user.firstName.should.be.eql(user.firstName);
            res2.body.data.user.lastName.should.be.eql(user.lastName);
            res2.body.data.user.email.should.be.eql(user.email);
            done();
        });
      });

    });

    it('should get all users for Admin user', function(done) {

      // get a duplicate key error for mongo collection every once in a while
      // this is completely test related due to speed of inserts

      var agent = chai.request.agent(server)

      for(let i=0;i<10;i++){
        testUsers.createUser();
      }

      let user=undefined;
      let isAdmin=true;

      testUsers.createAuthenticatedUser(user, isAdmin).then(admin => {
        // get user by email returns token
        agent.get('/v1/users/')
          .set('x-access-token', admin.token)
          .end((err1, res1) => {

            // meta
            should.not.exist(err1);
            testUtils.expectSuccessResponse(res1);

            res1.body.data.users.length.should.be.above(9);

            done();
        });
      });
    });
  
    it('should logout user', function(done) {

      let user = null;
      let isAdmin = true;

      testUsers.createAuthenticatedUser(user, !isAdmin).then(user => {
        // get user by email returns token
        chai.request(server)
          .delete('/v1/users/' + user.id + "/tokens")
          .query({user: user.id})
          .set('x-access-token', user.token)
          .end((err3, res3) => {

            // meta
            should.not.exist(err3);
            testUtils.expectSuccessResponse(res3);

            res3.body.api.route = "user";
            res3.body.api.action = "delete user by token";

            // TODO: make sure item is gone from database
            done();
          });
        });
    });
});