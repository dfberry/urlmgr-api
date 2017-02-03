"use strict";

var UrlModel = require('../data/url.js');

var Urls = {

  getById: function(id) {
    return new Promise(function(resolve, reject) {
      UrlModel.findById(id, (err, status) =>{
        if(err)reject(err);
        resolve(status);
      });
    });
  },
  getAll: function(){
    return new Promise(function(resolve, reject) {
      UrlModel.find({}, (err, status) =>{
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
  }
}

module.exports = Urls;