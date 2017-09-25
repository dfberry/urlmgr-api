 /*eslint-env mocha */
 "use strict";
 
 // TODO - not great tests - almost meaningless - how to make them better?
 
 const chai = require('chai'),
   should = chai.should(),
   auth = require('./authentication');
 
 describe('lib auth', function() {
 
     it('should fail due to nonexistent token', function(done) {
       let fakeToken = 'asdfasdf';
       let ipConfig = 'asdfasdadsf';

       auth.getClaimsPromise(fakeToken,ipConfig).then( result => {
         done(result);
       }).catch(err => {
         err.should.exist;
         done()
       });      
     });
 });