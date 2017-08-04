"use strict";

// each url has array of tags so need the url model
const UrlModel = require('../data/url.js'),
  _ = require('underscore');


let Tags = {

  getByUserId: function(userUuid) {
    let self = this;
    return new Promise(function(resolve, reject) {

      if(!userUuid) reject("tag by user id, user id is empty");

      let query = '{$match:{ "userUuid" : "' + userUuid + '", tags: { $gt: [] }}},{$project:{_id:0, tags:1}},{$unwind: "$tags"},{$group: {_id:"$tags", count:{$sum:1}}},{$project:{_id:0,tag:"$_id", count:1}},{$sort: {tag:1}}';

      UrlModel.findOne(query, (err, tagAggregation) =>{
        if(err)reject(err);
        resolve(self.createReturnableTagArray(tagAggregation));
      });
    });
  },
  getAll: function(){
    let self = this;
    return new Promise(function(resolve, reject) {
      
      let query = '{$match:{ tags: { $gt: [] }}},{$project:{_id:0, tags:1}},{$unwind: "$tags"},{$group: {_id:"$tags", count:{$sum:1}}},{$project:{_id:0,tag:"$_id", count:1}},{$sort: {tag:1}}';

      UrlModel.find(query, (err, tagAggregation) =>{
        if(err)reject(err);
        resolve(self.createReturnableTagArray(tagAggregation));
      });
    });
  },
  createReturnableTagArray: function(tags){
    if (!tags) return [];

    return this.mungePropertyAndKeys(tags);
  },
  mungePropertyAndKeys: function(arr){
    let jsonVariable = {};
    for(let i=1, len=arr.length; i < len; i++) {
      jsonVariable[arr[i].tag] = arr[i].count;        
    }    
    return jsonVariable;
  }
}

module.exports = Tags;