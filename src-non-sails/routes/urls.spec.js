/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

var chai = require('chai'),
  expect = chai.expect,
  chaiHttp = require('chai-http');

var config = require('../config/config.json');
chai.use(chaiHttp);


describe('urls', function() {
  describe('get', function() {
    it('should return all urls', function(done) {
      debugger;
      chai.request('http://localhost:' + config.port + '/urls')
        .then(function (res) {
          expect(res).to.have.status(200);
          done();
        })
        .catch(function (err) {
          throw err;
        });
    });
  });
});


