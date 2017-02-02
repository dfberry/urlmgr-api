"use strict";

var config = require('../config/config.json');

var Urls = {

  getById: function(id) {
    return Promise.resolve({id:id});
  },
  getAll: function(){
    return Promise.resolve([]);
  },
  deleteById: function(id){
    return Promise.resolve();
  },
  create: function(obj){
    obj.id = "newId";
    return Promise.resolve(obj);
  }
}

module.exports = Urls;