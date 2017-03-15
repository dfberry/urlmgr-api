"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('./server.js');

chai.use(chaiHttp);
let should = chai.should();

      let testUser = { 
        lastName: "berry",
        firstName: "dina",
        email: "dinaberry@outlook.com",
        password: "urlmgr"
      };

      chai.request(server)
          .post('/v1/users')
          .send(testUser)
          .end((err, res) => {

            if(err) return done(err);

            console.log(res.body);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.email.should.be.eql(testUser.email);
            res.body.should.not.have.property("password");

          });