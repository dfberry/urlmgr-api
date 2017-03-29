/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();

describe('root', function() {

    it.only('request should return meta data', function(done) {

      // create user
      chai.request(server)
          .get('/')
          .end((err, res) => {

            // success must have
            should.not.exist(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("data");
            res.body.should.have.property("commit");
            res.body.should.have.property("branch");

            //console.log(res.body);

            done();
 });
 });
});