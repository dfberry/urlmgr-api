/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai');
var should = chai.should();
var meta = require('./meta');

describe('meta', function() {

    it('should return meta json object of git info', function(done) {
      meta.git().then(response => {
        response.should.be.a('object');
        response.should.have.property('branch');
        response.should.have.property('commit');
        done();
      }).catch(err => {
        done(err);
      });
    });
    it('should merge meta git with new object', function(done) {
      
      let testObj = {
        test1: "abc"
      };

      meta.mergeWithMeta(testObj).then(sigma => {
        sigma.should.be.a('object');
        sigma.should.have.property('branch');
        sigma.should.have.property('commit');
        sigma.should.have.property('data');
        sigma.data.should.have.property('test1');
        sigma.data.test1.should.eq('abc');
        done();
      }).catch(err => {
        done(err);
      });
    });
});

      