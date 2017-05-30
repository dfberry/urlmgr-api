"use strict";

var UrlModel = require('../data/url.js');
//var authorization = require('./authorization.js');
var htmlLib = require('./html.js');
var _ = require('underscore');

var Urls = {

  getById: function(id,userUuid) {
    let self = this;
    return new Promise(function(resolve, reject) {

      let query = userUuid ? {_id: id, userUuid:userUuid} : {_id:id};

      UrlModel.findOne(query, (err, url) =>{
        if(err)reject(err);
        resolve(self.createReturnableUrl(url));
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
    let self = this;
    return new Promise(function(resolve, reject) {
      if (!userUuid) reject("userUuid is undefined");
      UrlModel.find({userUuid:userUuid}, (err, urls) =>{
        if(err)reject(err);
        resolve(self.createReturnableUrlArray(urls));
      });
    });
  },
  deleteById: function(uuid){
    let self = this;
    return new Promise(function(resolve, reject) {
      UrlModel.findByIdAndRemove({ _id: uuid }, (err, url) =>{
        if(err)reject(err);
        resolve(self.createReturnableUrl(url));
      });
    });
  },
  create: function(obj){
    let self = this;
    return new Promise(function(resolve, reject) {
      var urlObj = new UrlModel(obj);
        urlObj.save((err, _url) =>{
          if(err)reject(err);
          resolve(self.createReturnableUrl(_url));
        });
    });
  },
  createReturnableUrl: function(url){

    return {
      id: url._id,
      url: url.url,
      userId: url.userUuid,
      added: url.created.toDateString(),
      feeds: url.feeds,
      title: url.title
    };
  },
  createReturnableUrlArray: function(urls){
    let newArray = [];
    urls.forEach(url => {
      newArray.push(this.createReturnableUrl(url));
    });
    return newArray;
  },

// return feed and title
  getMetadata: function(url){
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
  },
  deleteAllUrlsRaw: function(){
    UrlModel.remove().exec();
  },
  createWithMeta(url){
    let self = this;
    return new Promise(function(resolve, reject) {
      if (!url || !url.url || !url.userUuid) reject("urls.createWithMeta - invalid arguments");

      self.getMetadata(url.url).then(meta => {

        var urlObj = new UrlModel(_.extend(url, meta));

        urlObj.save((err, returnedUrlObj) =>{

          if(err)reject(err);
          resolve(self.createReturnableUrl(returnedUrlObj));
        });
      }).catch(reject);


    });
  },

}

module.exports = Urls;