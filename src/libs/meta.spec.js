/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai');
var should = chai.should();
var expect = chai.expect();
var meta = require('./meta');
var utils = require('../utilities/test.utils');

describe('meta', function() {

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

      