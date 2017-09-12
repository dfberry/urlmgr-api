"use strict";

const chai = require('chai'),
  chaiHttp = require('chai-http');
const server = require('./server.js');

chai.use(chaiHttp);
let should = chai.should();

let user = { 
  email: "dinaberry@outlook.com",
  password: "xxxx"
};

//authenticate user
chai.request(server)
.post('/v1/auth')
.send(user)
.end((_err, _res) => {   

  // change password
  chai.request(server)
  .patch('/v1/users/password/reset')
  .query('user='+ _res.body.data.user.id) 
  .set('x-access-token', _res.body.data.user.token.token)
  .send({
    email: _res.body.data.user.email,
    password: "1234"
  }).end((err, res3) => {
    done();
  });

});  

