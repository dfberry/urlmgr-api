 /*eslint-env mocha */
//node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js  

//node --debug=5858 node_modules/mocha/bin/_mocha -t 20000 ./src/libs/git.spec.js
"use strict";

// TODO - not great tests - almost meaningless - how to make them better?

const chai = require('chai');
var should = chai.should();
const git = require('./git');

describe('git', function() {

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

      