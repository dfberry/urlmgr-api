/*eslint-env mocha */ 
"use strict";

const chai = require('chai'),
  meta = require('./meta'),
  utils = require('../utilities/test.utils'),
  should = chai.should(),
  expect = chai.expect();


describe('lib meta', function() {

    it('should return meta json object of git info', function(done) {
      meta.git().then(response => {
        response.should.be.a('object');
        utils.expectGitData(response);
        done();
      }).catch(err => {
        done(err);
      });
    });
});

      