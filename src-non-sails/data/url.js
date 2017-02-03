const config = require('../config/config.json');
const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const uuid = require('node-uuid');

mongoose.Promise = require('bluebird');
const loadClass = require('mongoose-class-wrapper');

mongoose.connect('mongodb://' + config.db.host + ":" + config.db.port + "/" + config.db.db);

var urlSchema = new mongoose.Schema({
  name: {type: String},
  title: {type: String},
  url: {type: String},
  html: {type : Schema.Types.Mixed},
  feeds: {type: Array},
  created: {type: Date, default: Date.now}
});

class UrlModel {
}
 
// Add methods from class to schema 
urlSchema.plugin(loadClass, UrlModel);
 
module.exports = mongoose.model('Url', urlSchema);