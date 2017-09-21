/*eslint-env mocha */
"use strict";

let config = {
  "env":"test",
  "executingPath" : process.cwd()
};

const chai = require('chai'),
  should = chai.should(),
  expect = require('chai').expect,
  testArgs = require('./args')(config);

describe('configArgs', function() {
  describe('getAlternateConfig', function() {
    it('should throw when args array doesn\'t have testConfig', function(done) {

      let processArgs = [ 
          '/usr/local/bin/node',
          '/usr/src/app/urlmgr/urlmgr-compose/urlmgr-api/dist/index.js' ];

      testArgs.getAlternateConfig(processArgs).then(()=> {
        done("succeeded when it was expected to throw");
      }).catch(err => {
        let answer = testArgs.getTestConfigFile();
        expect(answer).to.be.eql(undefined);
        let answer2 = testArgs.getTestConfigSettings();
        expect(answer2).to.be.eql(undefined);
        done();
      });

    });
    it('should throw when args array has -tc but nothing after it', function(done) {
      
      let processArgs = [ 
          '/usr/local/bin/node',
          '/usr/src/app/urlmgr/urlmgr-compose/urlmgr-api/dist/index.js',
          '-tc'
        ];

      testArgs.getAlternateConfig(processArgs).then(()=> {
        done("succeeded when it was expected to throw");        
      }).catch(err => {
        let answer = testArgs.getTestConfigFile();
        expect(answer).to.be.eql(undefined);
        let answer2 = testArgs.getTestConfigSettings();
        expect(answer2).to.be.eql(undefined);
        done();
      });
    });
    it('should throw when args array has -tc and invalid value', function(done) {
      
      let processArgs = [ 
          '/usr/local/bin/node',
          '/usr/src/app/urlmgr/urlmgr-compose/urlmgr-api/dist/index.js',
          '-tc',
          'xyz'
        ];

      testArgs.getAlternateConfig(processArgs).then(()=> {
        done("succeeded when it was expected to throw");        
      }).catch(err => {

        let answer = testArgs.getTestConfigFile();
        expect(answer).equal(undefined);

        let answer2 = testArgs.getTestConfigSettings();
        expect(answer2).equal(undefined);

        done();
      });
    });
    it('should return config values when args array has -tc and valid value', function(done) {
      
      let processArgs = [ 
          '/usr/local/bin/node',
          '/usr/src/app/urlmgr/urlmgr-compose/urlmgr-api/dist/index.js',
          '-tc',
          './config.test.json'
        ];

      testArgs.getAlternateConfig(processArgs).then(()=> {

        let answer = testArgs.getTestConfigFile();
        expect(answer).not.equal(undefined);

        let answer2 = testArgs.getTestConfigSettings();
        expect(answer2).not.equal(undefined);

        done();
      }).catch(err => {
        done(err);
      });
    });
  });
  describe('readConfigFile', function() {
    it('should return nothing if param is empty', function(done) {

      testArgs.readConfigFilePromise().then( x => {
        done(x);
      }).catch(err => {
        expect(err).to.equal("empty params");
        done();
      });
    });
    it('should return nothing if param is not valid location', function(done) {
      
      let data = testArgs.readConfigFilePromise('xyz');
      testArgs.readConfigFilePromise(data).then( x => {
        done(x);
      }).catch(err => {
        expect(err).to.not.equal("empty params");
        done();
      });
    });
    it('should return values if file location is valid', function(done) {
      let data = testArgs.readConfigFilePromise('./config.test.json');
      testArgs.readConfigFilePromise(data).then( x => {
        done(x);
      }).catch(err => {
        expect(err).to.not.equal("empty params");
        done();
      });
    });
  });
});