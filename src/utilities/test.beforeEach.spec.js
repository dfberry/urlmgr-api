/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  sut = require('./test.beforeEach'),
  should = chai.should();

describe('beforeEach', function() {

    it('should return ', function(done) {
      sut.clearOutDB().then( () => {
        done();
      }).catch(err => {
        done(err);
      });
    });
});