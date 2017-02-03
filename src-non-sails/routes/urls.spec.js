/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');

const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();

describe('urls', function() {

  describe('get', function() {
    it('should return array of urls', function(done) {
      chai.request(server)
          .get('/v1/urls')
          .end((err, res) => {

            if(err) return done(err);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.above(0);
            done();
          });
    });
    it('should return 1 url', function(done) {
      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';
      let testUrl = { 
        name: new Date + " mocha test",
        title: "test title",
        url: url,
        html: {},
        feeds: [] 
      };

      chai.request(server)
          .post('/v1/urls')
          .send(testUrl)
          .end((err, res1) => {

          if(err) return done(err);

          chai.request(server)
              .get('/v1/urls/' + res1.body._id)
              .end((err, res2) => {
                if(err) return done(err);
                res2.should.have.status(200);
                done();
              });

          });


    });
  });

    it('should return create 1 url', function(done) {

      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = { 
        name: new Date + " mocha test",
        title: "test title",
        url: url,
        html: {},
        feeds: [] 
      };

      chai.request(server)
          .post('/v1/urls')
          .send(testUrl)
          .end((err, res) => {

            if(err) return done(err);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.url.should.be.eql(url);
            done();
          });
    });



    it('should delete 1 url', function(done) {


      let url = 'http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/';

      let testUrl = { 
        name: "my mocha test name",
        title: "test title",
        url: url,
        html: {},
        feeds: [] 
      };

      chai.request(server)
                .post('/v1/urls')
                .send(testUrl)
                .end((err, res) => {

          if(err) return done(err);
          let createdUUID = res.body._id;

          chai.request(server)
              .delete('/v1/urls/' + res.body._id)
              .end((err, res) => {
                if(err) return done(err);

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body._id.should.be.eql(createdUUID);
                done();
              });
          });

  });
});


