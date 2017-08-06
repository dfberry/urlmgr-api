 /*eslint-env mocha */
 "use strict";

// each url has array of tags so need the url model
const chai = require('chai'),
  tags = require('./tags'),
  UrlModel = require("../data/url"),
  utils = require('../utilities/test.utils'),
  sinon = require('sinon'),
  should = chai.should(),
  expect = chai.expect(),
  sandbox = sinon.sandbox.create();

const exArrFromMongo = [
  { "count" : 1, "tag" : "angular" },
  { "count" : 1, "tag" : "azure" },
  { "count" : 2, "tag" : "blog" },
  { "count" : 99,"tag" : ".net" },
  { "count" : 2, "tag" : "dina" },
  { "count" : 1, "tag" : "evangelism" },
  { "count" : 1, "tag" : "javascript" },
  { "count" : 3, "tag" : "microsoft" },
  { "count" : 1, "tag" : "nodejs" },
  { "count" : 1, "tag" : "testing" }];

describe('tags library', function() {

  let stub;

  before(function() {
    stub = sinon.stub(tags, "aggregation").returns(Promise.resolve(exArrFromMongo));
  });
  after(function() {
    stub.restore();
  });

  it("should getAll successfully", function(done){
    tags.getAll().then(tagList => {
      tagList.should.deep.equal(exArrFromMongo);
      done();
    }).catch(err => {
      done(err);
    });
  });
  it("should getByUserId fails with empty userUuid", function(done){
    tags.getByUserId().then(tagList => {
      done(tagList);
    }).catch(err => {
      err.should.eql("user is empty");
      done();
    });
  });
  it("should getByUserId successfully", function(done){
    let user = "fakeIdNotUsedBecauseOfStub";

    tags.getByUserId(user).then(tagList => {
      tagList.should.deep.equal(exArrFromMongo);
      done();
    }).catch(err => {
      done(err);
    });
  });
});

      