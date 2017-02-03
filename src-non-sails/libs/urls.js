"use strict";

var Urls = {

  getById: function(id) {
    return Promise.resolve({id:id});
  },
  getAll: function(){
    return Promise.resolve([]);
  },
  deleteById: function(id){
    return Promise.resolve({id:id});
  },
  create: function(obj){
    obj.id = "newId";
    return Promise.resolve(obj);
  }
}

module.exports = Urls;