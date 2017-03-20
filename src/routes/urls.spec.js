/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');

const server = require('../server.js');

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect();

let testUser;

/*
var getToken = function() {

  
} 
*/


describe('urls', function() {

    beforeEach(function(done) {
        testUser = { 
            lastName: "before urls",
            firstName: "spec",
            email: Math.floor(new Date().getTime()) + "@urls.spec.com",
            password: "testPassword"
          };

          // create user
          chai.request(server)
              .post('/v1/users')
              .send(testUser)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.email.should.be.eql(testUser.email);


                testUser.id = res.body.id;
                let authUser = {
                  email: testUser.email,
                  password: testUser.password
                }

                // user is created, get token
                chai.request(server)
                    .post('/v1/auth')
                    .send(authUser)
                    .end((_err, _res) => { 
                      _res.should.have.status(200);
                      _res.body.token.length.should.be.above(200);

                      testUser.token =  _res.body.token;
                      done();
                });
            });
    });

  describe('auth success', function() {

    // TODO - make this test more meaningful
    it('should return array of urls', function(done) {
        chai.request(server)
          .get('/v1/urls')
          .query({user: testUser.id})
          .set('x-access-token', testUser.token)
          .end((err, res) => {
        
            should.not.exist(err);

            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
          });
    });
    it('should return 1 url', function(done) {

      let url = 'http://www.shouldReturn1UrlTest.com/';
      let testUrl = {
        name: Math.floor(new Date().getTime())+ " mocha test should return 1 url",
        title: "test title - should return 1 url",
        url: url,
        html: {},
        feeds: []
      };

      // insert url
      chai.request(server)
        .post('/v1/urls')
        .query({user: testUser.id})
        .set('x-access-token', testUser.token)
        .send(testUrl)
        .end((err, res1) => {

          
          should.not.exist(err);

          // fetch url
          chai.request(server)
            .get('/v1/urls/' + res1.body._id)
            .query({user: testUser.id})
            .set('x-access-token', testUser.token)
            .end((err, res2) => {
              should.not.exist(err);
              res2.should.have.status(200);
              res2.body.name.should.be.eq(testUrl.name);
              done();
            });
        });
    });
    it('should create 1 url', function(done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: Math.floor(new Date().getTime()) + " mocha test - should create 1 url",
        title: "test title - should create 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .query({user: testUser.id})
        .set('x-access-token', testUser.token)
        .send(testUrl)
        .end((err, res) => {

          should.not.exist(err);

          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.url.should.be.eql(url);
          res.body.name.should.be.eql(testUrl.name);
          done();
        });
    });
    it('should delete 1 url', function(done) {


      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: Math.floor(new Date().getTime()) + "my mocha test name - should delete 1 url",
        title: "test title - should delete 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .query({user: testUser.id})
        .set('x-access-token', testUser.token)
        .send(testUrl)
        .end((err, res) => {

          should.not.exist(err);
          let createdUUID = res.body._id;

          chai.request(server)
            .delete('/v1/urls/' + res.body._id)
            .query({user: testUser.id})
            .set('x-access-token', testUser.token)
            .end((err, res) => {
              should.not.exist(err);

              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body._id.should.be.eql(createdUUID);
              res.body.name.should.be.eql(testUrl.name);
              done();
            });
        });
    });

  });
  describe('auth fail', function() {
    it('should NOT return array of urls', function(done) {

      chai.request(server)
        .get('/v1/urls')
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
    it('should NOT return 1 url', function(done) {
      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';
      let testUrl = {
        name: Math.floor(new Date().getTime()) + " mocha test - should NOT return 1 url",
        title: "test title - should NOT return 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .send(testUrl)
        .query({user: testUser.id})
        .set('x-access-token', testUser.token)
        .end((err, res1) => {

          res1.should.have.status(200);

          chai.request(server)
            .get('/v1/urls/' + res1.body._id)
            .end((err, res2) => {
              res2.should.have.status(422);
              done();
            });
        });
    });
    it('should NOT create 1 url', function(done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: Math.floor(new Date().getTime()) + " mocha test - should NOT create 1 url",
        title: "test title - should NOT create 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .send(testUrl)
        .end((err, res) => {

          res.should.have.status(422);
          done();
        });
    });
    it('should NOT delete 1 url', function(done) {


      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = {
        name: Math.floor(new Date().getTime()) + "my mocha test name - should NOT delete 1 url",
        title: "test title - should NOT delete 1 url",
        url: url,
        html: {},
        feeds: []
      };

      chai.request(server)
        .post('/v1/urls')
        .query({user: testUser.id})
        .set('x-access-token', testUser.token)
        .send(testUrl)
        .end((err, res) => {

          res.should.have.status(200);
          let createdUUID = res.body._id;

          chai.request(server)
            .delete('/v1/urls/' + res.body._id)
            .end((err, res) => {
              res.should.have.status(422);
              done();
            });
        });
    });
  });
});


