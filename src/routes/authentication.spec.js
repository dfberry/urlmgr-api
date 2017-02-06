/*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  
"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('../server.js');

chai.use(chaiHttp);
let should = chai.should();

describe('authentication', function() {

    it('should authenticate 1 user to password', function(done) {

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

            let authUser = {
              email: testUser.email,
              password: testUser.password
            }

            // user is created, now authenticate user back to same password
            chai.request(server)
                .post('/v1/auth')
                .send(authUser)
                .end((_err, _res) => {            
                  if(_err)return done(_err);
                  _res.should.have.status(200);
                  _res.body.should.be.a('object');
                  _res.body.token.length.should.be.above(200);
                  done();
                });
                
                
          });
    });
});