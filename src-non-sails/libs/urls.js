"use strict";

var config = require('../config/config.json');

var Urls = {

  getById: function(id) {
    return id;
  },
  getAll: function(){
    return [];
  },
  deleteById: function(id){
    return null;
  },
  create: function(obj){
    obj.id = "newId";
    return obj;
  }
}

module.exports = Urls;