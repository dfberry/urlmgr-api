/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();

describe('users', function() {

    it('should create 1 user', function(done) {

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: new Date + "@test.com",
        password: "testPassword"
      };

      chai.request(server)
          .post('/v1/users')
          .send(testUser)
          .end((err, res) => {

            if(err) return done(err);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.email.should.be.eql(testUser.email);
            res.body.password.should.not.be.eql(testUser.password);
            done();
          });
    });
});