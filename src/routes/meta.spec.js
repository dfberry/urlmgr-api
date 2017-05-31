/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');
let utils = require('../utilities/test.utils');

chai.use(chaiHttp);
let should = chai.should();

describe('meta', function() {

    it('should return meta info for request', function(done) {

      // create user
      chai.request(server)
          .get('/v1/meta')
          .end((err, res) => {

            // success must have
            should.not.exist(err);
            utils.expectSuccessResponse(res);

            done();
          });
    });
});