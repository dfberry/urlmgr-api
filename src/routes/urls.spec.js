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

                // meta
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property("data");
                res.body.should.have.property("commit");
                res.body.should.have.property("branch");

                // data
                res.body.data.email.should.be.eql(testUser.email);

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

                      // data
                      _res.body.data.should.have.property("token");
                      _res.body.data.token.length.should.be.above(200);

                      testUser.token =  _res.body.data.token;
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
        
            // meta
            should.not.exist(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("data");
            res.body.should.have.property("commit");
            res.body.should.have.property("branch");

            // data
            res.body.data.should.be.a('array');
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
          
            // meta
            should.not.exist(err);
            res1.should.have.status(200);
            res1.body.should.be.a('object');
            res1.body.should.have.property("data");
            res1.body.should.have.property("commit");
            res1.body.should.have.property("branch");

            let id = res1.body.data._id;

            should.exist(id);

          // fetch url
          chai.request(server)
            .get('/v1/urls/' + id)
            .query({user: testUser.id})
            .set('x-access-token', testUser.token)
            .end((err, res2) => {

              // meta
              should.not.exist(err);
              res2.should.have.status(200);
              res2.body.should.be.a('object');
              res2.body.should.have.property("data");
              res2.body.should.have.property("commit");
              res2.body.should.have.property("branch");

              // data
              res2.body.data[0].name.should.be.eq(testUrl.name);
              done();
            });
        });
    });
    it('should return metadata for url', function(done) {
      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      // insert url
      chai.request(server)
        .post('/v1/urls/meta')
        .set('x-access-token', testUser.token)
        .send({
          user: testUser.id,
          url: url
        })
        .end((err, res) => {

          // meta
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property("data");
          res.body.should.have.property("commit");
          res.body.should.have.property("branch");

          // data
          res.body.data.title.should.be.eql('Project 31-A');
          res.body.data.feeds.should.be.a('array');
          res.body.data.feeds.length.should.be.eql(3);
          done();
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

          // meta
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property("data");
          res.body.should.have.property("commit");
          res.body.should.have.property("branch");

          // data
          res.body.data.url.should.be.eql(url);
          res.body.data.name.should.be.eql(testUrl.name);
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

          // meta
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property("data");
          res.body.should.have.property("commit");
          res.body.should.have.property("branch");

          let createdUUID = res.body.data._id;

          chai.request(server)
            .delete('/v1/urls/' + res.body.data._id)
            .query({user: testUser.id})
            .set('x-access-token', testUser.token)
            .end((err, res) => {

              // meta
              should.not.exist(err);
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property("data");
              res.body.should.have.property("commit");
              res.body.should.have.property("branch");

              // data
              res.body.data._id.should.be.eql(createdUUID);
              res.body.data.name.should.be.eql(testUrl.name);
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

          // meta
          should.not.exist(err);
          res1.should.have.status(200);
          res1.body.should.be.a('object');
          res1.body.should.have.property("data");
          res1.body.should.have.property("commit");
          res1.body.should.have.property("branch");

          let id = res1.body.data._id;
          should.exist(id);

          chai.request(server)
            .get('/v1/urls/' + id)
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

          // meta
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property("data");
          res.body.should.have.property("commit");
          res.body.should.have.property("branch");

          let createdUUID = res.body.data._id;
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


