/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();
const testUtils = require('../utilities/test.utils');

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