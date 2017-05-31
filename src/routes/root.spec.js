/*eslint-env mocha */
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../server.js'),
  should = chai.should(),
  testUtils = require('../utilities/test.utils');

chai.use(chaiHttp);

describe('root', function() {

  it('request should return meta data', function(done) {

    // create user
    chai.request(server)
      .get('/')
      .end((err, res) => {

        // success must have
        should.not.exist(err);
        testUtils.expectSuccessResponse(res);

        done();
      });
  });
});