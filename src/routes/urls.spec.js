/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  testUtils = require('../utilities/test.utils'),
  testTokens = require('../utilities/test.tokens'),
  TestUsers = require('../utilities/test.users'),
  TestUrls = require('../utilities/test.urls'),
  server = require('../server.js'),
  should = chai.should();

chai.use(chaiHttp);



describe('urls', function () {

  let testUser, 
    testUser2, 
    testUserId,
    testUserToken;

  beforeEach(function (done) {

    let isAdmin = true;
    let modifyName = true;

    TestUrls.deleteAllUrls();
    TestUsers.deleteAllUsers();
    testTokens.deleteAll();

    let pUser1 = TestUsers.createAuthenticatedUser(undefined, !isAdmin, !modifyName);

    // if the code runs too fast, the email isn't unique
    let pUser2 = TestUsers.createAuthenticatedUser(undefined, !isAdmin, modifyName);

    Promise.all([pUser1, pUser2]).then(users => {
      testUser = users[0];
      testUser2 = users[1];

      testUserId = testUser.id;
      testUserToken=testUser.token.token;     
      done();
    }).catch(err => {
      console.log("urls.spec.js before - can't create test user - " + JSON.stringify(err));
    });
  });

  describe('auth success', function () {

    // TODO - make this test more meaningful
    it('should return array of urls for this user only', function (done) {

      let arrLength = 3;

      try{
        // testUser has N urls
        for (let i = 0; i < arrLength; i++) {
          TestUrls.createUrl(testUser, { userUuid: testUser.id, url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com' });
        }

        // testUser2 has N urls
        for (let i = 0; i < arrLength; i++) {
          TestUrls.createUrl(testUser2, { userUuid: testUser2.id, url: 'http://www.dfberry.io' });
        }
      }catch(err){
        console.log("error creating N urls = " + err);
      }

      chai.request(server)
        .get('/v1/urls')
        .query('user='+ testUserId)
        .set('x-access-token', testUserToken)
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);

          // data
          res.body.data.urls.should.be.a('array');
          res.body.data.urls.length.should.be.eql(arrLength);

          res.body.data.urls.forEach(url => {
            testUtils.wellFormedUrl(url);
          });

          done();
        });
    });
    it('should return 1 url', function (done) {

      let testUrl = { url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com', title: 'Project 31-A' };

      // insert url
      chai.request(server)
        .post('/v1/urls')
        .query('user='+ testUserId)
        .set('x-access-token', testUser.token.token)
        .send(testUrl)
        .end((err, res1) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res1);

          should.exist(res1.body.data.url.id);

          // fetch url
          chai.request(server)
            .get('/v1/urls/' + res1.body.data.url.id)
            .query('user='+ res1.body.data.url.userId )
            .set('x-access-token', testUser.token.token)
            .end((err, res2) => {

              // meta
              should.not.exist(err);
              testUtils.expectSuccessResponse(res2);
              testUtils.wellFormedUrl(res2.body.data.url);

              // data
              res2.body.data.url.title.should.be.eq(testUrl.title);
              done();
            });
        });
    });
    it('should return metadata for url', function (done) {
      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      // get meta
      chai.request(server)
        .post('/v1/urls/meta')
        .set('x-access-token', testUser.token.token)
        .send({
          user: testUser.id,
          url: url
        })
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);

          // data
          res.body.data.url.title.should.be.eql('Project 31-A');
          res.body.data.url.feeds.should.be.a('array');
          res.body.data.url.feeds.length.should.be.eql(3);
          done();
        });
    });
    it('should create 1 url', function (done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      chai.request(server)
        .post('/v1/urls')
        .query('user='+ testUserId)
        .set('x-access-token', testUser.token.token)
        .send({ userUuid: testUser.id, url: url })
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);

          // data
          res.body.data.url.url.should.be.eql(url);
          res.body.data.url.userId.should.be.eql(testUser.id);
          res.body.data.url.feeds.should.be.a('array');
          res.body.data.url.title.should.be.eql('Project 31-A');

          testUtils.wellFormedUrl(res.body.data.url);
          done();
        });
    });
    it('should delete 1 url', function (done) {

      let testUrl = { url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com', title: 'Project 31-A' };

      // insert url
      chai.request(server)
        .post('/v1/urls')
        .query('user='+ testUserId)
        .set('x-access-token', testUserToken)
        .send(testUrl)
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);

          should.exist(res.body.data.url.id);

          // delete url
          chai.request(server)
            .delete('/v1/urls/' + res.body.data.url.id)
            .query('user=' + testUserId)
            .set('x-access-token', testUserToken)
            .end((err2, res2) => {

              // meta
              should.not.exist(err2);
              testUtils.expectSuccessResponse(res2);
              res2.body.api.route.should.be.eql("url");

              res2.body.api.action.should.be.eql("delete by id");
              testUtils.wellFormedUrl(res2.body.data.url);

              done();
            });
        });
    });

  });
  describe('auth fail', function () {
    it('should NOT return array of urls if not auth presented', function (done) {

      chai.request(server)
        .get('/v1/urls')
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('should NOT return 1 url', function (done) {
      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      // insert correctly 
      chai.request(server)
        .post('/v1/urls')
        .query('user='+ testUserId)
        .set('x-access-token', testUser.token.token)
        .send({ userUuid: testUser.id, url: url })
        .end((err, res1) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res1);

          should.exist(res1.body.data.url.id);

          // request url get without sending auth
          chai.request(server)
            .get('/v1/urls/' + res1.body.data.url.id)
            .query({ user: res1.body.data.url.userId })
            // commented out on purpose as part of test
            //.set('x-access-token', testUser.token)
            .end((err, res2) => {

              res2.should.have.status(422);
              done();
            });
        });
    });
    it('should NOT create 1 url because not user auth', function (done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: testUtils.uniqueString() + " mocha test - should NOT create 1 url",
        title: "test title - should NOT create 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .send({ testUrl })
        .end((err, res) => {

          res.should.have.status(422);
          done();
        });
    });
    it('should NOT delete 1 url without auth', function (done) {


      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: testUtils.uniqueString() + "my mocha test name - should NOT delete 1 url",
        title: "test title - should NOT delete 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .query('user='+ testUserId)
        .set('x-access-token', testUser.token.token)
        .send(testUrl)
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);

          let createdUUID = res.body.data.url.id;
          should.exist(createdUUID);

          chai.request(server)
            .delete('/v1/urls/' + createdUUID)
            .end((err, res) => {
              res.should.have.status(422);
              done();
            });
        });
    });
  });
});


