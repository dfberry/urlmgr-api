/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../server.js'),
  testUtils = require('../utilities/test.utils'),
  testUsers = require('../utilities/test.users'),
  should = chai.should(),
  expect = require('chai').expect;

chai.use(chaiHttp);

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
            testUtils.wellFormedUser(res.body.data.user);
            res.body.data.user.email.should.be.eql(testUser.email);
            res.body.data.user.roles.should.have.length(1);
            res.body.data.user.roles[0].should.be.eql('user');
            done();
          });
    });
    it('should NOT create user if it already exists- register', function(done) {

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
            testUtils.wellFormedUser(res.body.data.user);
            res.body.data.user.email.should.be.eql(testUser.email);
            res.body.data.user.roles.should.have.length(1);
            res.body.data.user.roles[0].should.be.eql('user');

            //now do it again -- but should get error
            chai.request(server)
            .post('/v1/users')
            .send(testUser)
            .end((err, res) => {

                should.exist(err);
                res.status.should.be.eq(403);
                res.body.api.error.message.should.be.eql('Email already exists');
              done();
            });
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
            testUtils.wellFormedUser(res.body.data.user);
            expect(res.body.data.user.roles.sort()).to.deep.equal(['admin','user']);

            // build obj to get authentication token
            let authUser = {
              email: testUser.email,
              password: testUser.password
            }

            let agent = chai.request.agent(server);
            agent.post('/v1/auth')
                .send(authUser)
                .end((_err, _res) => {            

                  testUtils.expectSuccessResponse(_res);
                  testUtils.wellFormedUser(res.body.data.user);
                  _res.body.data.user.email.should.be.eql(testUser.email);

                  done();
                });
          });
    });
    it('should get 1 user by email', function(done) {

      let user=undefined;
      let isAdmin=true;
      let agent = chai.request.agent(server);

      testUsers.createAuthenticatedUser(user, !isAdmin).then(user => {
 
        // get user by email returns token
        agent.get('/v1/users/email/' + user.email)
          .set('x-access-token', user.token)
          .end((err2, res2) => {

            // meta
            should.not.exist(err2);
            testUtils.expectSuccessResponse(res2);
            testUtils.wellFormedUser(res2.body.data.user);
            
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

      let agent = chai.request.agent(server)

      let numUsers = 3;
      for(let i=0, max=numUsers;i<max;i++){
        Promise.resolve(testUsers.createUser());
      }

      let isAdmin=true, 
        user=undefined;


      testUsers.createAuthenticatedUser(user, isAdmin).then(admin => {
        // get user by email returns token
        agent.get('/v1/users/')
          .set('x-access-token', admin.token)
          .end((err1, res1) => {

            // meta
            should.not.exist(err1);
            
            testUtils.expectSuccessResponse(res1);
            
            for(let i=0, max=res1.body.data.users.length;i<max;i++){
              testUtils.wellFormedUser(res1.body.data.users[i]);
            }

            res1.body.data.users.length.should.eql(numUsers+1);

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
            res3.body.status.should.eql('success');
            res3.body.state.should.eql(1);
            res3.body.api.route = "user";
            res3.body.api.action = "delete user by token";

            // TODO: make sure item is gone from database
            done();
          });
        });
    });
});