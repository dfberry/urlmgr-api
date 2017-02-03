/*eslint-env mocha */
"use strict";

const Url = require("./url");
var chai = require('chai');
let should = chai.should();
let expect = chai.expect;

describe('url model ', function() {

    it('should save 1 url', function(done){

      var testString = "this is a test " + Date();
      var urlObj = new Url({url:testString});

      urlObj.save((err, _url) =>{
         expect(err).to.be.null;
         _url.url.should.be.eql(testString);
         done();
      });
    });
    
    it('should remove 1 url', function(done) {

      var testString = "this is a test " + Date();
      var urlObj2 = new Url({url:testString});

      urlObj2.save((err, _url) =>{

         expect(err).to.be.null;
         _url.url.should.be.eql(testString);

         Url.findByIdAndRemove({ _id: _url._id }, (err, status) =>{
            expect(err).to.be.null;
            status.should.not.be.null;
          done();
         });

      });
    });

    it('should find 1 url', function(done) {

      var testString = "this is a test " + Date();
      var urlObj2 = new Url({url:testString});

      urlObj2.save((err, _url) =>{

         expect(err).to.be.null;
         _url.url.should.be.eql(testString);

         Url.findById({ _id: _url._id }, (err, status) =>{
            expect(err).to.be.null;
            status._id.should.be.eql(_url._id);
          done();
         });

      });
    });

    // TODO: this test is making alot of possibly erroneous 
    // assumptions - fix for more accurate validation at some point
    it('should find 2 urls', function(done) {

      var testString1 = "this is a test " + Date();
      var testString2 = "this is a 2 test " + Date();

      var urlObj1= new Url({url:testString1});
      var urlObj2 = new Url({url:testString2});

      urlObj1.save((err, _url1) => {
        urlObj2.save((err, _url2) => {
         Url.find({}, (err, arrayOfUrls) =>{
            expect(err).to.be.null;
            arrayOfUrls.length.should.be.above(1);
          done();
         });
        });
      });
    });
});
