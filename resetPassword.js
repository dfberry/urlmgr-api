"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('./src/server.js');

chai.use(chaiHttp);
let should = chai.should();

let testUser = { 
  email: "dinaberry@outlook.com",
  password: "xxxx"
};

chai.request(server)
    .put('/v1/users/password/reset')
    .send(testUser)
    .end((err, res) => {

      if(err) return done(err);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      
      console.log(res.body);
      return;

    });