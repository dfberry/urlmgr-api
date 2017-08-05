 /*eslint-env mocha */
"use strict";

// each url has array of tags so need the url model
const UrlModel = require('../data/url.js'),
  Promise = require("bluebird");


let Tags = {

  getByUserId: function(userUuid) {

    if(!userUuid) return Promise.reject("userUuid is empty");
    
    let query = [{$match:{ "userUuid" : userUuid, tags: { $gt: [] }}},{$project:{_id:0, tags:1}},{$unwind: "$tags"},{$group: {_id:"$tags", count:{$sum:1}}},{$project:{_id:0,tag:"$_id", count:1}},{$sort: {tag:1}}];
    return this.aggregation(query);

  },
  getAll: function(){

    let query = [{$match:{ tags: { $gt: [] }}},{$project:{_id:0, tags:1}},{$unwind: "$tags"},{$group: {_id:"$tags", count:{$sum:1}}},{$project:{_id:0,tag:"$_id", count:1}},{$sort: {tag:1}}];
    return this.aggregation(query);

  },
  aggregation: function(query){
    if(!query) Promise.reject("error: empty query for aggregation");
    return new Promise(function(resolve, reject) {
      UrlModel.aggregate(query, (err, tagAggregation) =>{
        if(err)reject(err);
        resolve(tagAggregation);
      });
    });
  },
  // DO NOT USE
  // this doesn't work well for tags that start with non-chars such as '.net'
  mungePropertyAndKeys: function(arr){
    let jsonVariable = {};
    for(let i=1, len=arr.length; i < len; i++) {
      jsonVariable[(arr[i].tag).toString()] = arr[i].count;        
    }    
    return jsonVariable;
  }
}

module.exports = Tags;