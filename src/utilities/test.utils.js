"use strict";


let TestUtils = {
  uniqueString: function(){
    return this.nowAsNumber() + this.randomBetween1And100000();
  },
  nowAsNumber: function(){
    return Math.floor(new Date().getTime());
  },
  randomBetween1And100000: function(){
    return Math.floor((Math.random() * 100000) + 1);
  },
  expectSuccessResponse: function(response){
      response.should.have.status(200);
      response.body.should.be.a('object');
      response.body.should.have.property("data");
      response.body.should.have.property("meta"); 
      response.body.should.have.property("api");
      response.body.should.have.property("status");
      response.body.should.have.property("state");

      response.body.status.should.be.eql("success");
      response.body.state.should.be.eql(1);

      if(response && response.body && response.body.data) this.verifyData(response.body.data);

      return this;
  },
  verifyData(data){
    if(data && data.user) this.verifyUser(data.user);
  },
  verifyUser(user){
    user.should.not.have.property("password");
    user.should.have.property("roles");
    user.roles.should.be.a('array');
  },
  wellFormedBody: function(returnedResponseBody){
      returnedResponseBody.should.be.a('object');
      returnedResponseBody.should.have.property("data");
      returnedResponseBody.should.have.property("meta");

      this.expectMetaData(returnedResponseBody.meta);
      this.expectData(returnedResponseBody);
      return this;
  },
  expectMetaData: function(response){

    response.body.meta.should.have.property("container");
    this.expectGitData(response.body.meta);


  },
  expectGitData: function(gitObj){

    gitObj.should.have.property("commit");
    gitObj.should.have.property("branch");

  },
  expectData: function(dataObj){

    dataObj.should.have.property('data');

  },
  wellFormedUser: function(user){

    // TBD: id and lastLogin - should this always be assumed?

    user.should.have.property('firstName');
    user.should.have.property('lastName');
    user.should.have.property('email');
    user.should.not.have.property("password");
    user.should.have.property("roles");
    user.roles.should.be.a('array');  

    if (user && user.token) user.token.length.should.be.above(200);

    return this;
  },
  wellFormedUrl: function(url){

    url.should.have.property('id');
    url.should.have.property('url');
    url.should.have.property('added');
    url.should.have.property('title');
    url.should.have.property("feeds");
    url.should.have.property("userId");
  
    url.should.not.have.property('_id');
    url.should.not.have.property('__v');
    url.should.not.have.property('userUuid');


    return this;
  }
}

module.exports = TestUtils;