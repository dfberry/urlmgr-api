 /*eslint-env mocha */
"use strict";

// TODO - not great tests - almost meaningless - how to make them better?

const chai = require('chai'),
  should = chai.should(),
  git = require('./git');

describe('lib git', function() {

    it('should return git commit', function(done) {
      git.gitBranch()
      .then(git.gitCommit)
      .then(commit => {
        done();
      }).catch(err => done(err));      
    });
    
    it('should return git branch', function(done) {
      git.gitBranch()
        .then(results => {
          //take the /n off the end
          results.trim().should.eq('master');
          done();
        }).catch(err => {
          done(err);
        });
      
      
    });
});

      