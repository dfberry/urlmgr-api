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


describe('tags route',  ()=> {

  let testUserAdmin, 
    testUserNotAdmin, 
    testUserNotAdminId,
    testUserNotAdminToken;

  beforeEach( (done) => {

    let isAdmin = true;
    let modifyName = true;

    TestUrls.deleteAllUrls();
    TestUsers.deleteAllUsers();
    testTokens.deleteAll();

    let pUser1 = TestUsers.createAuthenticatedUser(undefined, isAdmin, !modifyName);

    // if the code runs too fast, the email isn't unique
    let pUser2 = TestUsers.createAuthenticatedUser(undefined, !isAdmin, modifyName);

    Promise.all([pUser1, pUser2]).then(users => {
      testUserAdmin = users[0];
      testUserNotAdmin = users[1];

      testUserNotAdminId = testUserNotAdmin.id;
      testUserNotAdminToken=testUserNotAdmin.token.token;

      let pUrl1User1 = TestUrls.createUrl(testUserAdmin, { userUuid: testUserAdmin.id, url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/' + Math.random() });
      let pUrl2User1 = TestUrls.createUrl(testUserAdmin, { userUuid: testUserAdmin.id, url: 'http://www.dfberry.io/' +  Math.random(), tags:['dfberry', 'web', 'admin','notuser']});
      let pUrl3User1 = TestUrls.createUrl(testUserAdmin, { userUuid: testUserAdmin.id, url: 'http://berryintl.com/' +  Math.random(), tags:['berry', '.net', 'wayne','dfberry','admin','notuser']});
      
      let pUrl1User2 = TestUrls.createUrl(testUserNotAdmin, { userUuid: testUserNotAdmin.id, url: 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/' + Math.random() });
      let pUrl2User2 = TestUrls.createUrl(testUserNotAdmin, { userUuid: testUserNotAdmin.id, url: 'http://www.dfberry.io/' +  Math.random(), tags:['dfberry', 'web','user']});
      let pUrl3User2 = TestUrls.createUrl(testUserNotAdmin, { userUuid: testUserNotAdmin.id, url: 'http://berryintl.com/' +  Math.random(), tags:['berry', '.net', 'wayne','user']});
      let pUrl4User2 = TestUrls.createUrl(testUserNotAdmin, { userUuid: testUserNotAdmin.id, url: 'http://microsoft.com/' +  Math.random(), tags:['ms', '.net', 'channel9', 'azure','user']});
      let pUrl5User2 = TestUrls.createUrl(testUserNotAdmin, { userUuid: testUserNotAdmin.id, url: 'https://www.microsoft.com/en-us/garage/profiles/maker-js/' +  Math.random(), tags:['ms', 'js', 'garage', 'iot','user']});

      return Promise.all([pUrl1User1, pUrl2User1, pUrl3User1, pUrl1User2, pUrl2User2,pUrl3User2,pUrl4User2, pUrl5User2 ]);
    }).then(results => {
      console.log("test urls created");
      done();
    }).catch(err => {
      console.log(err);
    });
  });

  describe('auth success', () => {

    it('should return tags for all users', (done) => {

      let allTags = [ { count: 3, tag: '.net' },
        { count: 2, tag: 'admin' },
        { count: 1, tag: 'azure' },
        { count: 2, tag: 'berry' },
        { count: 1, tag: 'channel9' },
        { count: 3, tag: 'dfberry' },
        { count: 1, tag: 'garage' },
        { count: 1, tag: 'iot' },
        { count: 1, tag: 'js' },
        { count: 2, tag: 'ms' },
        { count: 2, tag: 'notuser' },
        { count: 4, tag: 'user' },
        { count: 2, tag: 'wayne' },
        { count: 2, tag: 'web' } ];

      chai.request(server)
        .get('/v1/tags/all')
        .query('user='+ testUserNotAdminId) //this should be ignored
        .set('x-access-token', testUserNotAdminToken)
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);
          res.body.api.action.should.equal('get all tags - public tag cloud');

          // data
          res.body.data.tags.should.be.a('array');
          res.body.data.tags.length.should.equal(14);
          res.body.data.tags.should.deep.equal(allTags);          

          done();
        });
    });
    it('should return tags for non admin user', (done) => {

      let userTags = [ { count: 2, tag: '.net' },
                      { count: 1, tag: 'azure' },
                      { count: 1, tag: 'berry' },
                      { count: 1, tag: 'channel9' },
                      { count: 1, tag: 'dfberry' },
                      { count: 1, tag: 'garage' },
                      { count: 1, tag: 'iot' },
                      { count: 1, tag: 'js' },
                      { count: 2, tag: 'ms' },
                      { count: 4, tag: 'user' },
                      { count: 1, tag: 'wayne' },
                      { count: 1, tag: 'web' } ];

      chai.request(server)
        .get('/v1/tags/user/' + testUserNotAdminId)
        //.query('user='+ testUserNotAdminId) //this should be ignored
        .set('x-access-token', testUserNotAdminToken)
        .end((err, res) => {

          // meta
          should.not.exist(err);
          testUtils.expectSuccessResponse(res);
          res.body.api.action.should.equal('get all tags grouped by count for user (user id in param)');

          // data
          res.body.data.tags.should.be.a('array');
          res.body.data.tags.length.should.equal(12);
          res.body.data.tags.should.deep.equal(userTags);          

          done();
        });
    });
  });
});