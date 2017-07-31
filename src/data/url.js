"use strict"

const db = require('mongoose'),
loadClass = require('mongoose-class-wrapper');

db.Promise = require('bluebird');

let urlSchema = new db.Schema({
  name: {type: String, default: ""},
  title: {type: String, default: ""},
  url: {type: String},
  userUuid: {type: String},
  html: {type : db.Schema.Types.Mixed},
  feeds: {type: Array, default: []},
  tags: { type: Array, default: []},
  created: {type: Date, default: Date.now}
});

class UrlModel {}

// Add methods from class to schema 
urlSchema.plugin(loadClass, UrlModel);
 
module.exports = db.model('Url', urlSchema);