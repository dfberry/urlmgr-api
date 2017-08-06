"use strict";

const UrlModel = require('../data/url.js'),
  htmlLib = require('./html.js'),
  _ = require('underscore');

let Urls = {

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
      if (!uuid) reject("userUuid is undefined");

      UrlModel.findByIdAndRemove({ _id: uuid }, (err, url) =>{
        if(err)reject(err);
        resolve(self.createReturnableUrl(url));
      });
    });
  },
  create: function(obj){
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!obj) reject("can't create url because url is empty");

      let urlObj = new UrlModel(obj);

      urlObj.save((err, _url) =>{
        if(err)reject(err);
        resolve(self.createReturnableUrl(_url));
      });
    });
  },
  createReturnableUrl: function(url){

    if(!url)return {};

    return {
      id: url._id.toString(),
      url: url.url,
      userId: url.userUuid.toString(),
      added: url.created.toDateString(),
      feeds: url.feeds,
      tags: url.tags,
      title: url.title
    };
  },
  createReturnableUrlArray: function(urls){
    if (!urls) return [];

    let newArray = [];
    urls.forEach(url => {
      newArray.push(this.createReturnableUrl(url));
    });
    return newArray;
  },

// return feed and title
// get these from contacting that url
// if that url can't be reached return successful/empty object
// so process keeps going
// TBD: all off-site http/https/ws must be able to return (successfully) if the url can't be reached
  getMetadata: function(url){
    return new Promise(function(resolve, reject) {

        let data = { feeds: [], title: "" };

        if(!url) throw new Error("url is empty");

        htmlLib.getHtml(url).then(htmlReturned => {

          data.feeds = htmlLib.getFeeds(htmlReturned);
          data.title = htmlLib.getTitle(htmlReturned);

          resolve(data);
        }).catch(err => {

          // the url can't be reached -- it is off server and out in cloud somewhere - but DNS fails
          if(err && (err.name=="RequestError") && err.error && (err.error.code=="ENOTFOUND")){
            resolve(data);
          } else { 
            reject(err);
          }
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

        let urlObj = new UrlModel(_.extend(url, meta));

        urlObj.save((err, returnedUrlObj) =>{

          if(err)reject(err);
          resolve(self.createReturnableUrl(returnedUrlObj));
        });
      }).catch(reject);
    });
  },
}

module.exports = Urls;