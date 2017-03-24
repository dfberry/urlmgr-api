"use strict";

var UrlModel = require('../data/url.js');
var authorization = require('./authorization.js');
var htmlLib = require('./html.js');

var Urls = {

  getById: function(id,userUuid) {
    return new Promise(function(resolve, reject) {

      let query = userUuid ? {_id: id, userUuid:userUuid} : {_id:id};

      UrlModel.find(query, (err, status) =>{
        if(err)reject(err);
        resolve(status);
      });
    });
  },
  /*
  getAll: function(){
    return new Promise(function(resolve, reject) {
      UrlModel.find({}, (err, status) =>{
        if(err)reject(err);
        resolve(status);
      });
    });
  },
  */
  getAllByUser: function(userUuid){
    return new Promise(function(resolve, reject) {
      if (!userUuid) reject("userUuid is undefined");
      UrlModel.find({userUuid:userUuid}, (err, status) =>{
        if(err)reject(err);
        resolve(status);
      });
    });
  },
  deleteById: function(uuid){
    return new Promise(function(resolve, reject) {
      UrlModel.findByIdAndRemove({ _id: uuid }, (err, status) =>{
        if(err)reject(err);
        resolve(status);
      });
    });
  },
  create: function(obj){
    return new Promise(function(resolve, reject) {
      var urlObj = new UrlModel(obj);
      urlObj.save((err, _url) =>{
        if(err)reject(err);
        resolve(_url);
      });
    });
  },
  createReturnableUrl: function(url){

    return {
      id: url._id,
      url: url.url,
      userId: url.userUuid,
      added: url.created.toDateString()
    };
  },
  createReturnableUrlArray: function(urls){
    let newArray = [];
    urls.forEach(url => {
      newArray.push(createReturnableUrl(url));
    });
  },

// return feed and title
  getMetadata: function(url){
    var self = this;
    return new Promise(function(resolve, reject) {

        if(!url) throw new Error("url is empty");

        htmlLib.getHtml(url).
        then(htmlReturned => {
          let feeds = htmlLib.getFeeds(htmlReturned);
          let title = htmlLib.getTitle(htmlReturned);
          resolve({ feeds: feeds, title: title });
        }).catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = Urls;