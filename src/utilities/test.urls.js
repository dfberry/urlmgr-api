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

    Promise.resolve(urlLib.create(urlObj));

  },
  deleteAllUrls: function(){
    urlLib.deleteAllUrlsRaw();
  }
}
module.exports = TestUrls;