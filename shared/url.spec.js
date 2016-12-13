"use strict";
const assert = require('assert');
const expect = require('chai').expect;
const path = require('path');
const UrlMgr= require('./url.js');
const nock = require('nock');
const fs = require('fs');
const getFeeds = require('get-feeds');
/*

        let filePath = path.join(__dirname,'/feeds.sample.2.html');
        let expected = require('./feeds.sample.3.json');

*/
describe('url', ()=> {
  describe('get', ()=> {
  
    it('should get title == null', function(done) { 

        let urlMgr = new UrlMgr(null);

        urlMgr.getTitle(null, null, null, function(result) {
            console.log(result);
            expect(result).to.not.be.null;
            expect(result).to.equal('');
            done();
        });
    });
    it('should get title from url', function(done) { 

        
        let url = 'http://www.micrsoft.com';
        let urlMgr = new UrlMgr();
  
        urlMgr.getTitle(url, null, null, function(result) {
            expect(result).to.equal(url);
            done();
        });
    });
    it('should get title from feeds', function(done) { 

        let url = 'http://www.hanselman.com/';
        let htmlPath = path.join(__dirname,'/feeds.sample.2.html');
        let feeds = require('./feeds.sample.3.json');
        let html = fs.readFileSync(htmlPath, 'utf8');

        let urlMgr = new UrlMgr();
  
        urlMgr.getTitle(url, html, feeds, function(result) {
            expect(result).to.equal(feeds[0].title);
            done();
        });
    });
    it('should get title from html', function(done) { 

        let url = 'http://www.hanselman.com/';
        let htmlPath = path.join(__dirname,'/feeds.sample.2.html');
        let feeds = null; // on purpose
        let html = fs.readFileSync(htmlPath, 'utf8');

        let urlMgr = new UrlMgr();
  
        urlMgr.getTitle(url, html, feeds, function(result) {
            expect(result).to.equal("Scott Hanselman - Coder, Blogger, Teacher, Speaker, Author");
            done();
        });
    });
    it('should get title from url when html has no title object', function(done) { 

        let url = 'http://www.hanselman.com/';
        let htmlPath = path.join(__dirname,'/feeds.sample.2.html');
        let feeds = require('./feeds.sample.3.json');
        let html = fs.readFileSync(htmlPath, 'utf8');

        let urlMgr = new UrlMgr();
  
        urlMgr.getTitle(url, '<body></body>', null, function(result) {
            expect(result).to.equal(url);
            done();
        });
    });
    it('should get title from html when feed doesn\'t have title', function(done) { 

        let url = 'http://www.hanselman.com/';
        let htmlPath = path.join(__dirname,'/feeds.sample.2.html');
        let feeds = [
                {
                    
                    "type": "application/rss+xml",
                    "href": "http://feeds.hanselman.com/ScottHanselman"
                }
            ];
        let html = fs.readFileSync(htmlPath, 'utf8');

        let urlMgr = new UrlMgr();

        urlMgr.getTitle(url, html, feeds, function(result) {
            expect(result).to.equal("Scott Hanselman - Coder, Blogger, Teacher, Speaker, Author");
            done();
        });
    }); 
    it('should get feeds from html', function(done) {
        this.timeout(10000); 
        let fullurl = 'http://www.hanselman.com/';
        let filePath = path.join(__dirname,'/feeds.sample.2.html');
        let expected = require('./feeds.sample.3.json');
        let html = fs.readFileSync(filePath, 'utf8');
        let sut = new UrlMgr(fullurl);
 
        sut.getFeed(fullurl, html,(feeds) => {
            expect(JSON.stringify(feeds)).to.equal(JSON.stringify(expected));
            done();
        });

    }); 

    it('should get html', function(done) { 

        let sut = new UrlMgr();
        let fullurl = 'http://www.micrsoft.com/';
        let url = 'http://www.micrsoft.com';
        let path = '/'
        let expected = "HTTP TEST";

        nock(url)
            .get(path)
            .reply(200, expected);

        sut.getHtml(fullurl, function(result) {
            expect(result).to.have.deep.property('text',expected);
            expect(result).to.have.deep.property('status',200);
            expect(result).to.not.have.deep.property('feeds');
            done();
        });

    });
    it('should get json', function(done) { 

        let sut = new UrlMgr();
        let fullurl = 'http://www.micrsoft.com/';
        let url = 'http://www.micrsoft.com';
        let path = '/'
        let expected = {"id":1};

        nock(url)
            .get(path)
            .reply(200, expected);

        sut.getHtml(fullurl, function(result) {
            expect(result).to.have.deep.property('text.id',1);
            expect(result).to.not.have.deep.property('text.id','1');
            done();
        });

    });


    it('should get feeds from static html with get-feeds', (done) => {
        let urlMgr = new UrlMgr(null);
        const htmlPath = path.join(__dirname,'/html.sample1.html');
        const html = fs.readFileSync(htmlPath, 'utf8');
        const url = 'http://feeds.hanselman.com/'

        urlMgr.getFeed(url, html, (feeds) => {
            //console.log(feeds)
            expect(feeds).to.not.be.null;
            expect(feeds.length).to.equal(1);
            expect(feeds[0]).to.have.deep.property('title','Scott Hanselman\'s Blog');
            expect(feeds[0]).to.have.deep.property('type','application/rss+xml');
            expect(feeds[0]).to.have.deep.property('href','http://feeds.hanselman.com/ScottHanselman');
            done();
        });

    });

    xit('should get live http feeds', function(done){
        this.timeout(10000);
        let urlMgr = new UrlMgr();
        let url = 'http://www.hanselman.com/';
        urlMgr.get(url, (obj) => {
            //console.log(JSON.stringify(obj));
            done();
        });
    })
    it.only('should get live https feeds', function(done){
        this.timeout(10000);
        let urlMgr = new UrlMgr();
        let url = 'https://www.microsoft.com/en-us/';
        urlMgr.get(url, (obj) => {
            //console.log(JSON.stringify(obj));
            done();
        });
    })

  });
});