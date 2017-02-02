/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');

const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();
const config = require('../config/config.json');



describe('urls', function() {

  beforeEach(function() {
    
  });

  describe('get', function() {

    it('should return all urls', function(done) {

      chai.request(server)
          .get('/v1/urls')
          .end((err, res) => {
              debugger;
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
              done();
          });




    });
  });
});


