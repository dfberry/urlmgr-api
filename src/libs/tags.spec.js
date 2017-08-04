"use strict";

// each url has array of tags so need the url model
const chai = require('chai'),
  tags = require('./tags'),
  urlModel = require("../data/url"),
  utils = require('../utilities/test.utils'),
  sinon = require('sinon'),
  should = chai.should(),
  expect = chai.expect();

const exArrFromMongo = [
{ "count" : 99, "tag" : ".net" },
{ "count" : 1, "tag" : "angular" },
{ "count" : 1, "tag" : "azure" },
{ "count" : 2, "tag" : "blog" },
{ "count" : 2, "tag" : "dina" },
{ "count" : 1, "tag" : "evangelism" },
{ "count" : 1, "tag" : "javascript" },
{ "count" : 3, "tag" : "microsoft" },
{ "count" : 1, "tag" : "nodejs" },
{ "count" : 1, "tag" : "testing" }];

describe('tags', function() {

    let stubUrlModelFind;

    beforeEach(function () {
        stubUrlModelFind = sinon.stub(urlModel, 'find').resolves(exArrFromMongo);
    });
    afterEach(function () { stubUrlModelFind.restore(); });

    it('should convert mongo format to property/value', function(done) {
      tags.createReturnableTagArray(exArrFromMongo).then(response => {
        response.should.be.a('object');
        utils.expectTagCleanedData(response);
        done();
      }).catch(err => {
        err.should.not.exist();
        done(err);
      });
    });
    /*it('should create get tags and transform', function(done) {

      

      tags.getAll().then(tags => {

        tags.should.not.exist();
        tags.should.be.a('array');
        tags['.net'].should.eq(99); // only testing one, TBD - is there something better?
                      
        done();
      }).catch(err => {
        err.should.not.exist();
      });
    });*/
});

      