"use strict";

const urlLib = require('../libs/urls'),
  testUtils = require('./test.utils');


/* returns raw url objs, not wrapped in api response info */

let TestUrls = {

  // userObj: {id: '', email:'', etc}
  // urlObj: {url: '', userUuid: ''}
  createUrl: function(userObj, urlObj){

    if (!urlObj || !userObj) throw Error ("user or url is missing");

    urlObj.userUuid = userObj.id;

    return urlLib.create(urlObj);

  },
  deleteAllUrls: function(){
    return new Promise(function(resolve, reject) {
      try{
        urlLib.deleteAllUrlsRaw();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = TestUrls;