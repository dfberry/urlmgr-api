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
        email: Math.floor(new Date().getTime()) + "@test.com",
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
    it('should get 1 user by email', function(done) {

      var agent = chai.request.agent(server)

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: Math.floor(new Date().getTime()) + "@test.com",
        password: "testPassword"
      };

      agent.post('/v1/users/')
          .send(testUser)
          .end((err, res) => {

            if(err) return done(err);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.email.should.be.eql(testUser.email);
            res.body.password.should.not.be.eql(testUser.password);

            agent.get('/v1/users/email/' + testUser.email)
              .end((err2, res2) => {
                if (err2) return done(err2);
                res2.should.have.status(200);
                res2.body.email.should.be.eql(res.body.email);
                res2.body.email.should.be.eql(testUser.email);
                done();
          });
        });
    });
});