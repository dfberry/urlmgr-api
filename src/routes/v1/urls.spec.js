/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  testUtils = require('../../utilities/test.utils'),
  testTokens = require('../../utilities/test.tokens'),
  TestUsers = require('../../utilities/test.users'),
  TestUrls = require('../../utilities/test.urls'),
  server = require('../../server.js'),
  should = chai.should();

chai.use(chaiHttp);



describe('route v1 urls', function() {

  let testUser,
    testUser2,
    testUserId,
    pUserDinaBerry,
    testUserToken;

  beforeEach(function(done) {

    let isAdmin = true;
    let modifyName = true;

    TestUrls.deleteAllUrls().then( () => {
      return TestUsers.deleteAllUsers();
    }).then( () => {
      return testTokens.deleteAll();
    }).then( () => {
      let pUser1 = TestUsers.createAuthenticatedUser(undefined, !isAdmin, !modifyName);
      
      // if the code runs too fast, the email isn't unique
      let pUser2 = TestUsers.createAuthenticatedUser(undefined, !isAdmin, modifyName);
  
      // if the code runs too fast, the email isn't unique
      let pUserPublic = TestUsers.createAuthenticatedUser({email:"dinaberry@outlook.com", password:"testtesttest"}, !isAdmin, !modifyName);
  
      return Promise.all([pUser1, pUser2, pUserPublic]);
    }).then(users => {
        testUser = users[0];
        testUser2 = users[1];
        pUserDinaBerry = users[2];
        testUserId = testUser.id;
        testUserToken = testUser.token.token;
        console.log("before Each done");
        return done();
    }).catch(err => {
      console.log("urls.spec.js before - can't create test user - " + JSON.stringify(err));
    });
  });

  describe('public success', function() {

    describe('public tag cloud success', function() {
      it('should return empty array of urls when no tags selected', function(done) {

        chai.request(server)
          .post('/v1/urls/tags')
          .send({
            tags: []
          })
          .end((err, res) => {

            // meta
            should.not.exist(err);
            testUtils.expectSuccessResponse(res);

            // data
            res.body.data.urls.should.be.a('array');
            res.body.data.urls.length.should.be.eql(0);
            res.body.data.urls.forEach(url => {
              testUtils.wellFormedPublicUrl(url);
            });

            done();
          });

      });
      it('should return empty array of urls when unused tag is set', function(done) {

        let pUrl1 = TestUrls.createUrl(testUser, {
          userUuid: testUser.id,
          url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com',
          "tags": [".net", "dina", "js"]
        });
        let pUrl2 = TestUrls.createUrl(testUser, {
          userUuid: testUser.id,
          url: 'http://test2.com',
          "tags": [".net", "db", "wayne", "sql"]
        });

        let pUrl3 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.dfberry.io',
          "tags": [".net", "db", "john", "sql"]
        });
        let pUrl4 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.test3.io',
          "tags": ["john", "db", "mongo"]
        });
        let pUrl5 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.test4.io',
          "tags": ["john", "db", "postgresql"]
        });

        Promise.all([pUrl1,pUrl2,pUrl3,pUrl4,pUrl5]).then(urls => {

          //don't really care about urls

          chai.request(server)
          .post('/v1/urls/tags')
          .send({
            tags: ["xyz-does-not-exist"]
          })
          .end((err, res) => {

            // meta
            should.not.exist(err);
            testUtils.expectSuccessResponse(res);

            // data
            res.body.data.urls.should.be.a('array');
            res.body.data.urls.length.should.be.eql(0);
            res.body.data.urls.forEach(url => {
              testUtils.wellFormedPublicUrl(url);
            });


            done();

            
          });
        }).catch(err => {
          console.log(err);
          done(err);
        });



      });
      it('should return filled array of urls when 1 used tag is set', function(done) {

        let p1 = TestUrls.createUrl(testUser, {
          userUuid: testUser.id,
          url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com',
          "tags": [".net", "dina", "js"]
        });
        let p2 = TestUrls.createUrl(testUser, {
          userUuid: testUser.id,
          url: 'http://test2.com',
          "tags": [".net", "db", "wayne", "sql"]
        });

        let p3 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.dfberry.io',
          "tags": [".net", "db", "john", "sql"]
        });
        let p4 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.test3.io',
          "tags": ["john", "db", "mongo"]
        });
        let p5 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.test4.io',
          "tags": ["john", "db", "postgresql"]
        });

        Promise.all([p1,p2,p3,p4,p5]).then(urls => {
          chai.request(server)
            .post('/v1/urls/tags')
            .send({
              tags: ["john"]
            })
            .end((err, res) => {

              // meta
              should.not.exist(err);
              testUtils.expectSuccessResponse(res);

              // data
              res.body.data.urls.should.be.a('array');
              res.body.data.urls.length.should.be.eql(3);
              res.body.data.urls.forEach(url => {
                testUtils.wellFormedPublicUrl(url);
              });
              done();
            });
          }).catch(err => {
            console.log(err);
            done(err);
          });
      });
      it('should return filled array of urls when n used tags are set', function(done) {

        let p1 = TestUrls.createUrl(testUser, {
          userUuid: testUser.id,
          url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com',
          "tags": [".net", "dina", "js"]
        });
        let p2 = TestUrls.createUrl(testUser, {
          userUuid: testUser.id,
          url: 'http://test2.com',
          "tags": [".net", "db", "wayne", "sql"]
        });

        let p3 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.dfberry.io',
          "tags": [".net", "db", "john", "sql"]
        });
        let p4 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.test3.io',
          "tags": ["john", "db", "mongo"]
        });
        let p5 = TestUrls.createUrl(testUser2, {
          userUuid: testUser2.id,
          url: 'http://www.test4.io',
          "tags": ["john", "db", "postgresql"]
        });
        Promise.all([p1,p2,p3,p4,p5]).then(urls => {

          chai.request(server)
            .post('/v1/urls/tags')
            .send({
              tags: ["john", "dina"]
            })
            .end((err, res) => {

              // meta
              should.not.exist(err);
              testUtils.expectSuccessResponse(res);

              // data
              res.body.data.urls.should.be.a('array');
              res.body.data.urls.length.should.be.eql(4);
              res.body.data.urls.forEach(url => {
                testUtils.wellFormedPublicUrl(url);
              });

              TestUrls.deleteAllUrls();
              done();
            });
          }).catch(err => {
            console.log(err);
            done(err);
          });
      });
    });
    describe('public thinkingabout ', function() {
      it('should return array of urls when public user is created', function(done) {

        let p1 = TestUrls.createUrl(pUserDinaBerry, {
          userUuid: pUserDinaBerry.id,
          url: 'http://1.unittest.test.com',
          "tags": [".net", "dina", "js", "1"]
        });

        let p2 = TestUrls.createUrl(pUserDinaBerry, {
          userUuid: pUserDinaBerry.id,
          url: 'http://2.unittest.test.com',
          "tags": ["2"]
        });

        let p3 = TestUrls.createUrl(pUserDinaBerry, {
          userUuid: pUserDinaBerry.id,
          url: 'http://3.unittest.test.com',
          "tags": [".net", "3"]
        });

        let p4 = TestUrls.createUrl(pUserDinaBerry, {
          userUuid: pUserDinaBerry.id,
          url: 'http://4.unittest.test.com',
          "tags": [".net", "dina", "js","4"]
        });

        let p5 = TestUrls.createUrl(pUserDinaBerry, {
          userUuid: pUserDinaBerry.id,
          url: 'http://5.unittest.test.com',
          "tags": [".net", "dina", "js","5"]
        });
        let p6 = TestUrls.createUrl(pUserDinaBerry, {
          userUuid: pUserDinaBerry.id,
          url: 'http://6.unittest.test.com',
          "tags": [".net", "dina", "js","6"]
        });

        Promise.all([p1,p2,p3,p4,p5,p6]).then(urls => {

          chai.request(server)
            .get('/v1/urls/public')
            .end((err, res) => {

              // meta
              should.not.exist(err);
              testUtils.expectSuccessResponse(res);

              // data
              res.body.data.urls.should.be.a('array');

              // because config file says 30 so it will return all 6
              res.body.data.urls.length.should.be.eql(6);

              res.body.data.urls.forEach(url => {
                testUtils.wellFormedPublicUrl(url);
              });

              done();
            });
          }).catch(err => {
            console.log(err);
            done(err);
          });
      });
    });
  });

  describe('auth success', function() {
    // TODO - make this test more meaningful
    it('should return array of urls for this user only', function(done) {

      let arrLength = 3;

      let pArr = [];



        // testUser has N urls
        for (let i = 0; i < arrLength; i++) {
          pArr.push(TestUrls.createUrl(testUser, {
            userUuid: testUser.id,
            url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com'
          }));
        }

        // testUser2 has N urls
        for (let i = 0; i < arrLength; i++) {
          pArr.push(TestUrls.createUrl(testUser2, {
            userUuid: testUser2.id,
            url: 'http://www.dfberry.io'
          }));
        }
      
      Promise.all(pArr).then( urls => {
        chai.request(server)
        .get('/v1/urls')
        .query('user=' + testUserId)
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
      }).catch(err =>  {
        console.log("error creating N urls = " + err);
      });
    });
    it('should return 1 url', function(done) {

      let testUrl = {
        url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com',
        title: 'Project 31-A'
      };

      // insert url
      chai.request(server)
        .post('/v1/urls')
        .query('user=' + testUserId)
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
            .query('user=' + res1.body.data.url.userId)
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
    it('should return metadata for url', function(done) {
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
    it('should create 1 url', function(done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      chai.request(server)
        .post('/v1/urls')
        .query('user=' + testUserId)
        .set('x-access-token', testUser.token.token)
        .send({
          userUuid: testUser.id,
          url: url
        })
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);

          // data
          res.body.data.url.url.should.be.eql(url);
          res.body.data.url.userId.should.be.eql(testUser.id);
          res.body.data.url.feeds.should.be.a('array');
          res.body.data.url.tags.should.be.a('array');
          res.body.data.url.title.should.be.eql('Project 31-A');

          testUtils.wellFormedUrl(res.body.data.url);
          done();
        });
    });
    it('should delete 1 url', function(done) {

      let testUrl = {
        url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com',
        title: 'Project 31-A'
      };

      // insert url
      chai.request(server)
        .post('/v1/urls')
        .query('user=' + testUserId)
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
  describe('auth fail', function() {
    it('should NOT return array of urls if not auth presented', function(done) {

      chai.request(server)
        .get('/v1/urls')
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('should NOT return 1 url', function(done) {
      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      // insert correctly 
      chai.request(server)
        .post('/v1/urls')
        .query('user=' + testUserId)
        .set('x-access-token', testUser.token.token)
        .send({
          userUuid: testUser.id,
          url: url
        })
        .end((err, res1) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res1);

          should.exist(res1.body.data.url.id);

          // request url get without sending auth
          chai.request(server)
            .get('/v1/urls/' + res1.body.data.url.id)
            .query({
              user: res1.body.data.url.userId
            })
            // commented out on purpose as part of test
            //.set('x-access-token', testUser.token)
            .end((err, res2) => {

              res2.should.have.status(422);
              done();
            });
        });
    });
    it('should NOT create 1 url because not user auth', function(done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: testUtils.uniqueString() + " mocha test - should NOT create 1 url",
        title: "test title - should NOT create 1 url",
        url: url,
        html: {},
        feeds: [],
        tags: ['testing', 'javascript']
      };

      chai.request(server)
        .post('/v1/urls')
        .send({
          testUrl
        })
        .end((err, res) => {

          res.should.have.status(422);
          done();
        });
    });
    it('should NOT delete 1 url without auth', function(done) {


      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: testUtils.uniqueString() + "my mocha test name - should NOT delete 1 url",
        title: "test title - should NOT delete 1 url",
        url: url,
        html: {},
        feeds: [],
        tags: ['testing', 'javascript']
      };

      chai.request(server)
        .post('/v1/urls')
        .query('user=' + testUserId)
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