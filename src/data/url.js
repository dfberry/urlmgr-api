"use strict"

const db = require('mongoose');
const loadClass = require('mongoose-class-wrapper');
const uuid = require('node-uuid');
db.Promise = require('bluebird');

var urlSchema = new db.Schema({
  name: {type: String},
  title: {type: String},
  url: {type: String},
  html: {type : db.Schema.Types.Mixed},
  feeds: {type: Array},
  created: {type: Date, default: Date.now}
});

class UrlModel {}

// Add methods from class to schema 
urlSchema.plugin(loadClass, UrlModel);
 
module.exports = db.model('Url', urlSchema);