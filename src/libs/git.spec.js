 /*eslint-env mocha */
"use strict";

// TODO - not great tests - almost meaningless - how to make them better?

const chai = require('chai'),
  should = chai.should(),
  git = require('./git');

describe('lib git', function() {

    it('should return git commit', function(done) {
      git.gitCommit().then( result =>{
        console.log("commit hash = " + result);
        done();
      }).catch(err => done(err));      
    });
    
    it('should return git branch', function(done) {
      git.gitBranch().then(results => {
          //take the /n off the end
          console.log("branch = " + results);
          done();
        }).catch(err => {
          done(err);
        });
    });
    it('should return git branch', function(done) {
      git.gitInfo().then(results => {
          //take the /n off the end
          console.log("gitInfo = " + JSON.stringify(results));
          results.commit.should.exist;
          results.branch.should.exist;
          done();
        }).catch(err => {
          done(err);
        });
    });
});

      