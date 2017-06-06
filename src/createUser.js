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

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      
      console.log(res.body);

    });