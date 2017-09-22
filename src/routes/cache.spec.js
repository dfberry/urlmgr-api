/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../server.js'),
  utils = require('../utilities/test.utils'),
  should = chai.should();

chai.use(chaiHttp);


describe('cache', function() {
    it('should return cache info for request', function(done) {

      // create user
      chai.request(server)
          .get('/v1/cache')
          .end((err, res) => {

            // success must have
            should.not.exist(err);
            utils.expectSuccessResponse(res);
            res.body.data.cache.action.should.eql('getall');

            done();
          });
    });
});