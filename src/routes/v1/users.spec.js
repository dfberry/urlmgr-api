/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../server.js'),
  testUtils = require('../../utilities/test.utils'),
  TestUrls = require('../../utilities/test.urls'),
  TestUsers = require('../../utilities/test.users'),
  TestTokens = require('../../utilities/test.tokens'),
  should = chai.should(),
  expect = require('chai').expect;

chai.use(chaiHttp);

describe('route v1 users', function() {

    let generalUser;
    let adminUser;

    beforeEach(function(done) {

      TestUrls.deleteAllUrls().then( () => {
        return TestUsers.deleteAllUsers();
      }).then( () => {
        return TestTokens.deleteAll();
      }).then( () => {
        let isAdmin = true;
        let modifyName = true;
  
        let pGeneralUser = TestUsers.createAuthenticatedUser(undefined, !isAdmin, !modifyName);
        let pAdminUser = TestUsers.createAuthenticatedUser(undefined, isAdmin, !modifyName);
  
        return Promise.all([pGeneralUser, pAdminUser]);
      }).then(users => {
        generalUser = users[0];
        adminUser = users[1];

        done();
      }).catch(err => {
        done(err);
      });
    });



    it('should create 1 user - register', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: testUtils.uniqueString() + "@test.com",
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
    it('should change 1 user\'s password', function(done) {

      let isAdmin = true;
      let modifyName = true;

      let newPassword = "test.test.test";

      chai.request(server)
      .patch('/v1/users/password/reset')
      .query('user='+ generalUser.id) 
      .set('x-access-token', generalUser.token.token)
      .send({
        email: generalUser.email,
        password: newPassword
      })
      .end((err, res) => {

        // meta
        should.not.exist(err);
        testUtils.expectSuccessResponse(res);
        res.body.api.action.should.equal('reset password');          

        // authenticate with new password
        let authUser = {
          email: generalUser.email,
          password: newPassword // new password used here!!!
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
    it('should NOT create user if it already exists- register', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: testUtils.uniqueString() + "@test.com",
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
        email: testUtils.uniqueString() + "@test.com",
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
                  testUtils.wellFormedUser(_res.body.data.user);
                  _res.body.data.user.email.should.be.eql(testUser.email);

                  done();
                });
          });
    });
    it('should get 1 user by email', function(done) {

      let isAdmin=true;
      let agent = chai.request.agent(server);

      TestUsers.createAuthenticatedUser(undefined, !isAdmin).then(userWithToken => {
 
        testUtils.wellFormedUser(userWithToken);

        // get user by email returns token
        agent.get('/v1/users/email/' + userWithToken.email)
          .query('user=' + userWithToken.id)
          .set('x-access-token', userWithToken.token.token)
          .end((err2, res2) => {

            // meta
            should.not.exist(err2);
            testUtils.expectSuccessResponse(res2);
            testUtils.wellFormedUser(res2.body.data.user);

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
        Promise.resolve(TestUsers.createUser());
      }

      let isAdmin=true, 
        user=undefined;


      TestUsers.createAuthenticatedUser(user, isAdmin).then(admin => {
        // get user by email returns token
        agent.get('/v1/users/')
          .set('x-access-token', admin.token.token)
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

      TestUsers.createAuthenticatedUser(user, !isAdmin).then(user => {
        // get user by email returns token
        chai.request(server)
          .delete('/v1/users/' + user.id + "/tokens")
          .query('user=' + user.id)
          .set('x-access-token', user.token.token)
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