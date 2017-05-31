/*eslint-env mocha */
"use strict";
const Promise = require("bluebird"),
  fs = Promise.promisifyAll(require("fs")),
  chai = require('chai'),
  should = chai.should(),
  html = require('./html');

// from root of project
const testLinks = [
  { path: './testData/feedlink1.html', linkCount :0, feedCount: 0, title: 'Google' },
  { path: './testData/hanselman.com.html', linkCount :10, feedCount: 1, title: 'Scott Hanselman - Coder, Blogger, Teacher, Speaker, Author' },
  { path: './testData/31a.html', linkCount :6, feedCount: 3, title: 'Project 31-A' }
];

describe('html', function() {

    it('should return html', function(done) {
      html.getHtml('http://www.google.com')
      .then(response => {
        done();
      }).catch(err => {
        done(err);
      })
    });
    it('should fail when url is empty', function(done) {
      html.getHtml()
      .then(response => {
        done(response);
      }).catch(err => {
        done();
      })
    });
    it('should return links ', function(done) {

      for(let i = 0; i<testLinks.length; i++){
        
        let path = testLinks[i].path;
        let htmlFound = fs.readFileSync(path, 'utf8');
        let links = html.getLinks(htmlFound);

        links.should.be.a('array');
        links.length.should.eq(testLinks[i].linkCount);    
      }
      done();
    });
    it('should return feed links ', function(done) {

      for(let i = 0; i<testLinks.length; i++){
        
        let path = testLinks[i].path;
        let htmlFound = fs.readFileSync(path, 'utf8');
        let feeds = html.getFeeds(htmlFound);

        feeds.should.be.a('array');
        feeds.length.should.eq(testLinks[i].feedCount);    
      }
      done();
    });
    it('should return feed links ', function(done) {

      for(let i = 0; i<testLinks.length; i++){
        
        let path = testLinks[i].path;
        let htmlFound = fs.readFileSync(path, 'utf8');
        let title = html.getTitle(htmlFound);

        title.should.be.a('string');
        title.should.eq(testLinks[i].title);    
      }
      done();
    });
});

      